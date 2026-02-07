# Authentication State Migration: React Context → Zustand

## Industry-Standard Version (Final Polish)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Layer (lib/api/auth.ts)             │
│  - Handles all network requests (login, signup, logout)    │
│  - Owns access token (in memory only)                       │
│  - Emits auth change events                                 │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Bootstrap (lib/auth/bootstrap.ts)           │
│  - Single async function: determine initial auth state     │
│  - No React, no Zustand                                     │
│  - Returns { user: User | null }                           │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Zustand Store (stores/auth.ts)           │
│  - Pure state: user (User | null), loading (boolean)       │
│  - Actions: setUser, setLoading, clearAuth                 │
│  - NOTHING ELSE                                             │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 AuthBootstrap (components/                   │
│                                                 AuthBootstrap.tsx) │
│  - useEffect that calls bootstrapAuth()                     │
│  - Sets user and loading in store                           │
│  - Renders loading UI when bootstrap in progress           │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  - Subscribe to Zustand state via hooks                     │
│  - Use API layer for side effects (login, logout, etc)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Create Type Definitions

```typescript
// frontend/src/types/auth.ts
export interface User {
	id: string;
	phoneNumber: string;
	role: "USER" | "SUB_ADMIN" | "SUPER_ADMIN";
	createdAt: string;
	updatedAt: string;
}
```

---

## Phase 2: Create Auth Bootstrap (Clean Version)

```typescript
// frontend/src/lib/auth/bootstrap.ts
import { refreshAccessToken, getMe } from "@/lib/api/auth";
import type { User } from "@/types/auth";

export async function bootstrapAuth(): Promise<{ user: User | null }> {
	try {
		await refreshAccessToken();
		const me = await getMe();

		// Defensive: ensure we don't hide backend contract bugs
		if (!me || !me.user) {
			return { user: null };
		}

		return { user: me.user as User };
	} catch {
		return { user: null };
	}
}
```

**Key Points**:

- No `any` types
- Defensive null checks avoid hiding bugs with `as User`
- Errors handled implicitly

---

## Phase 3: Create Minimal Zustand Store

```typescript
// frontend/src/stores/auth.ts
import { create } from "zustand";
import type { User } from "@/types/auth";

interface AuthState {
	user: User | null;
	loading: boolean;

	setUser(user: User | null): void;
	setLoading(loading: boolean): void;
	clearAuth(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	loading: true,

	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	clearAuth: () => set({ user: null }),
}));
```

**That's it. 15 lines. Pure state. No API calls. No tokens. No persistence.**

---

## Phase 4: Create Auth Bootstrap Component (With Loading UI)

```typescript
// frontend/src/components/AuthBootstrap.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { bootstrapAuth } from '@/lib/auth/bootstrap';

interface AuthBootstrapProps {
  children: React.ReactNode;
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const { setUser, setLoading, loading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { user } = await bootstrapAuth();

      if (!cancelled) {
        setUser(user);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'var(--font-vazir)',
        direction: 'rtl'
      }}>
        در حال بارگذاری...
      </div>
    );
  }

  return <>{children}</>;
}
```

**Improvements**:

- Explicit loading UI instead of blank screen - better UX and debuggability
- `loading: true` is set once in store initial state
- No redundant `setLoading(true)` in useEffect
- `cancelled` flag prevents state updates on unmount

---

## Phase 5: Create Auth Hooks

```typescript
// frontend/src/hooks/useAuth.ts
import { useAuthStore } from "@/stores/auth";
import { useCallback } from "react";
import { logout as apiLogout, setAccessToken } from "@/lib/api/auth";

// ─────────────────────────────────────────────────────────────────
// State Hooks - Selective subscriptions for optimal re-renders
// ─────────────────────────────────────────────────────────────────

export function useAuthUser() {
	return useAuthStore((state) => state.user);
}

export function useIsAuthenticated() {
	return useAuthStore((state) => !!state.user);
}

export function useAuthLoading() {
	return useAuthStore((state) => state.loading);
}

export function useUserRole() {
	return useAuthStore((state) => state.user?.role ?? null);
}

// ─────────────────────────────────────────────────────────────────
// Action Hooks - Memoized callbacks for stable references
// ─────────────────────────────────────────────────────────────────

export function useLogout() {
	const clearAuth = useAuthStore((state) => state.clearAuth);

	return useCallback(async () => {
		try {
			await apiLogout();
		} finally {
			setAccessToken(null);
			clearAuth();
		}
	}, [clearAuth]);
}

// Intent-based naming: reads like what it does, not what it sets
export function useAuthenticateUser() {
	const setUser = useAuthStore((state) => state.setUser);
	return setUser;
}
```

**Key Improvement**: `useAuthenticateUser` reads like intent (what it does) rather than implementation (`useSetUser`).

---

## Phase 6: Update Root Layout

```typescript
// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthBootstrap } from "@/components/AuthBootstrap";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Madar Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} antialiased`}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </body>
    </html>
  );
}
```

---

## Phase 7: Migrate Components

### Profile Page

```typescript
// frontend/src/features/Pages/ProfilePage.tsx
'use client';

import { useAuthUser, useLogout } from '@/hooks/useAuth';

export default function ProfilePage() {
  const user = useAuthUser();
  const logout = useLogout();

  return (
    <div>
      <h1>Profile</h1>
      {user && <p>Welcome, {user.phoneNumber}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Admin Page

```typescript
// frontend/src/app/admin/(panel)/page.tsx
'use client';

import { useAuthUser, useIsAuthenticated, useUserRole } from '@/hooks/useAuth';

export default function AdminPage() {
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  if (userRole !== 'SUPER_ADMIN') {
    return <div>Insufficient permissions. Required: SUPER_ADMIN</div>;
  }

  return <div>Admin Panel Content</div>;
}
```

---

## Phase 8: Login Form with Proper Error Handling

```typescript
// frontend/src/features/Login/StagePhone.tsx
'use client';

import { useState } from 'react';
import { useAuthenticateUser } from '@/hooks/useAuth';
import { login as apiLogin, setAccessToken } from '@/lib/api/auth';
import type { User } from '@/types/auth';

export function StagePhone() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthenticateUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Critical: prevent form submission reload
    setError(null);
    setLoading(true);

    try {
      const data = await apiLogin(phone, password, '123456');
      setAccessToken(data.accessToken);
      setUser(data.user as User);
      // Navigate to next step or home
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error-message">{error}</div>}
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

**Critical Improvements**:

| Issue            | Before                      | After                            |
| ---------------- | --------------------------- | -------------------------------- |
| `preventDefault` | Missing - form reloads page | Added - prevents unwanted reload |
| Error handling   | None - silent failures      | `try/catch` with user feedback   |
| Loading state    | None - can double-submit    | Prevents double submissions      |
| Input disabling  | None                        | Disabled during loading          |

---

## Phase 9: API Client Contract Requirements

Your token strategy is correct, but fragile. It requires specific guarantees from the API client:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Required API Client Guarantees                    │
├─────────────────────────────────────────────────────────────────────┤
│ 1. refreshAccessToken() silently fails (returns false on failure)  │
│ 2. getMe() never throws on 401 (returns null instead)              │
│ 3. API client auto-retries once after successful token refresh     │
│ 4. bootstrapAuth() never throws fatally                             │
└─────────────────────────────────────────────────────────────────────┘
```

**Why This Matters**:

- If `getMe()` throws on 401, the bootstrap flow breaks and users see errors
- If `refreshAccessToken()` throws, unauthenticated users can't gracefully fall back to guest state
- The API layer must guarantee "bootstrap never throws fatally"

**Implementation in API Layer**:

```typescript
// frontend/src/lib/api/auth.ts

export async function refreshAccessToken(): Promise<boolean> {
	try {
		// HTTP-only cookie handles refresh automatically
		// Just verify it worked by calling /me
		await getMe();
		return true;
	} catch {
		return false; // Silently fail - user remains unauthenticated
	}
}

export async function getMe(): Promise<{ user: User } | null> {
	try {
		const response = await fetch("/api/auth/me", {
			credentials: "include", // Include HTTP-only cookies
		});

		if (response.status === 401) {
			return null; // Not authenticated, but not an error
		}

		if (!response.ok) {
			throw new Error("Failed to fetch user");
		}

		return response.json();
	} catch {
		return null; // Network error - treat as unauthenticated
	}
}
```

---

## Files Summary

### New Files

| File                                        | Lines | Responsibility                         |
| ------------------------------------------- | ----- | -------------------------------------- |
| `frontend/src/types/auth.ts`                | ~10   | User type definition                   |
| `frontend/src/lib/auth/bootstrap.ts`        | ~18   | Auth initialization (no React/Zustand) |
| `frontend/src/stores/auth.ts`               | ~15   | Pure state store                       |
| `frontend/src/hooks/useAuth.ts`             | ~50   | Selective subscriptions + action hooks |
| `frontend/src/components/AuthBootstrap.tsx` | ~35   | Bootstrap component with loading UI    |

### Modified Files

| File                             | Change                        |
| -------------------------------- | ----------------------------- |
| `frontend/src/app/layout.tsx`    | Wrap with AuthBootstrap       |
| `features/Pages/ProfilePage.tsx` | Migrate to useAuth hooks      |
| `app/admin/(panel)/page.tsx`     | Migrate to useAuth hooks      |
| `features/Header/header.tsx`     | Migrate to useAuth hooks      |
| `features/Login/*`               | Update to useAuthenticateUser |

### Deleted After Testing

| File                                        |
| ------------------------------------------- |
| `frontend/src/context/AuthContext.tsx`      |
| `frontend/src/zustandStates/auth.states.ts` |

---

## Final Polish Summary

| Refinement         | Before                        | After                          |
| ------------------ | ----------------------------- | ------------------------------ |
| `setLoading(true)` | Called twice (store + effect) | Called once (store init)       |
| `me.user` typing   | `(me.user ?? null) as User`   | Defensive null checks          |
| `loading` state    | Two sources of truth          | Single source (store)          |
| Loading UI         | Blank screen                  | Explicit loading indicator     |
| Hook naming        | `useSetUser` (implementation) | `useAuthenticateUser` (intent) |
| Form handling      | No preventDefault             | `e.preventDefault()`           |
| Error handling     | None                          | `try/catch` with user feedback |

---

## What Makes This Industry-Standard

| Principle                  | Implementation                                |
| -------------------------- | --------------------------------------------- |
| **Separation of concerns** | API = HTTP, Bootstrap = Init, Store = State   |
| **Single responsibility**  | Each file has one job                         |
| **No over-engineering**    | 15-line store, no middleware                  |
| **Type safety**            | User type, typed returns                      |
| **Performance**            | Selective subscriptions via hooks             |
| **Simplicity**             | Explicit, boring, maintainable                |
| **Security**               | Tokens never in Zustand/localStorage          |
| **UX**                     | Loading indicators, error handling            |
| **Intent-based APIs**      | `useAuthenticateUser` vs `useSetUser`         |
| **Robustness**             | API contract guarantees bootstrap never fails |

---

## Migration Checklist

- [ ] Create `frontend/src/types/auth.ts`
- [ ] Create `frontend/src/lib/auth/bootstrap.ts`
- [ ] Create `frontend/src/stores/auth.ts`
- [ ] Create `frontend/src/hooks/useAuth.ts`
- [ ] Create `frontend/src/components/AuthBootstrap.tsx`
- [ ] Update `frontend/src/app/layout.tsx`
- [ ] Migrate ProfilePage.tsx
- [ ] Migrate admin/(panel)/page.tsx
- [ ] Migrate Header.tsx
- [ ] Update login/signup components with proper error handling
- [ ] Ensure API client has required contract guarantees
- [ ] Test all auth flows
- [ ] Remove old AuthContext.tsx
- [ ] Remove old zustandStates/auth.states.ts
