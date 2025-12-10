"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
	login as apiLogin,
	signup as apiSignup,
	logout as apiLogout,
	refreshAccessToken,
	getMe,
	onAuthChange,
} from "@/src/lib/api/auth";
interface AuthContextType {
	user: any | null;
	isAuthenticated: boolean;
	loading: boolean;
	login: (phone: string, pass: string, otp: string) => Promise<void>;
	signup: (phone: string, pass: string, otp: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);

	// -----------------------------
	// HYDRATE AUTH STATE ON REFRESH
	// -----------------------------
	useEffect(() => {
		let unsub: (() => void) | null = null;

		(async () => {
			try {
				// attempt to obtain an access token using refresh cookie
				const data = await refreshAccessToken();
				if (data?.user) {
					setUser(data.user);
					setLoading(false);
					return;
				}

				// if refresh didn't include user, request /auth/me
				try {
					const me = await getMe();
					setUser(me.user ?? me);
				} catch (err) {
					setUser(null);
				}
			} catch (err) {
				setUser(null);
			} finally {
				setLoading(false);
			}
		})();

		// allow other parts of the app to react to token changes
		unsub = onAuthChange((token) => {
			if (!token) setUser(null);
		});

		return () => {
			if (unsub) unsub();
		};
	}, []);

	// -----------------------------
	// LOGIN FLOW
	// -----------------------------
	const login = async (phone: string, pass: string, otp: string) => {
		const data = await apiLogin(phone, pass, otp);
		setUser(data.user ?? data);
	};

	// -----------------------------
	// SIGNUP FLOW
	// -----------------------------
	const signup = async (phone: string, pass: string, otp: string) => {
		const res = await apiSignup(phone, pass, otp);
		setUser(res.user ?? res);
	};

	// -----------------------------
	// LOGOUT FLOW
	// -----------------------------
	const logout = async () => {
		await apiLogout();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				loading,
				login,
				signup,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
