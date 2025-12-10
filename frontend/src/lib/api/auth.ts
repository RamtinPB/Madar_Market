const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

let accessToken: string | null = null;
let refreshPromise: Promise<any> | null = null;
// Development-only fallback: store the raw refresh token returned by the
// backend (only when NODE_ENV !== 'production') so the client can supply
// it in a request body if the cookie isn't stored by the browser.
let devRefreshToken: string | null = null;
// Load persisted dev refresh token (dev only) so fallback survives reloads
if (process.env.NODE_ENV !== "production") {
	try {
		const saved = sessionStorage.getItem("devRefreshToken");
		if (saved) devRefreshToken = saved;
	} catch (e) {
		/* ignore */
	}
}

const authEvents = new EventTarget();

export const onAuthChange = (cb: (token: string | null) => void) => {
	const handler = (e: Event) => cb((e as CustomEvent).detail?.token ?? null);
	authEvents.addEventListener("auth-change", handler as EventListener);
	return () =>
		authEvents.removeEventListener("auth-change", handler as EventListener);
};

export const setAccessToken = (token: string | null) => {
	accessToken = token;
	authEvents.dispatchEvent(
		new CustomEvent("auth-change", { detail: { token } })
	);
};

export const getAccessToken = () => accessToken;

const clearTokens = () => {
	accessToken = null;
	authEvents.dispatchEvent(
		new CustomEvent("auth-change", { detail: { token: null } })
	);
	if (process.env.NODE_ENV !== "production") {
		try {
			sessionStorage.removeItem("devRefreshToken");
		} catch (e) {}
		devRefreshToken = null;
	}
};

export async function authenticatedFetch(
	input: RequestInfo,
	init?: RequestInit
) {
	init = init || {};
	init.credentials = init.credentials ?? "include";
	init.headers = init.headers ?? {};

	if (accessToken) {
		(init.headers as any)["Authorization"] = `Bearer ${accessToken}`;
	}

	let res = await fetch(input, init);

	if (res.status !== 401) return res;

	// try refresh flow once
	try {
		await refreshAccessToken();
	} catch (err) {
		clearTokens();
		return res;
	}

	// retry original request with new token
	if (accessToken)
		(init.headers as any)["Authorization"] = `Bearer ${accessToken}`;
	res = await fetch(input, init);
	return res;
}

export async function requestOtp(phoneNumber: string, purpose: string) {
	const response = await authenticatedFetch(`${API_BASE}/auth/request-otp`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ phoneNumber, purpose }),
	});
	if (!response.ok) throw new Error("Failed to request OTP");
	return response.json();
}

export async function refreshAccessToken() {
	if (refreshPromise) return refreshPromise;

	refreshPromise = (async () => {
		try {
			// First try: standard cookie-based refresh
			let response = await fetch(`${API_BASE}/auth/refresh`, {
				method: "POST",
				credentials: "include",
			});

			// If cookie-based attempt failed and we have a dev fallback token,
			// try sending it in the body (dev only).
			if (
				!response.ok &&
				devRefreshToken &&
				process.env.NODE_ENV !== "production"
			) {
				response = await fetch(`${API_BASE}/auth/refresh`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ refreshToken: devRefreshToken }),
				});
			}

			if (!response.ok) throw new Error("Token refresh failed");

			const data = await response.json();
			if (data.accessToken) setAccessToken(data.accessToken);
			// backend may rotate refresh token and return it in dev
			if (process.env.NODE_ENV !== "production" && data.refreshToken) {
				devRefreshToken = data.refreshToken;
				try {
					if (devRefreshToken)
						sessionStorage.setItem("devRefreshToken", devRefreshToken);
				} catch (e) {}
			}
			return data;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

export async function login(
	phoneNumber: string,
	password: string,
	otp: string
) {
	const res = await fetch(`${API_BASE}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ phoneNumber, password, otp }),
	});

	if (!res.ok) throw new Error("Login failed");

	const data = await res.json();
	if (data.accessToken) setAccessToken(data.accessToken);
	// capture dev-only refresh token if returned (persist across reloads)
	if (process.env.NODE_ENV !== "production" && data.refreshToken) {
		devRefreshToken = data.refreshToken;
		try {
			if (devRefreshToken)
				sessionStorage.setItem("devRefreshToken", devRefreshToken);
		} catch (e) {}
	}
	return data;
}

export async function signup(
	phoneNumber: string,
	password: string,
	otp: string
) {
	const res = await fetch(`${API_BASE}/auth/signup`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ phoneNumber, password, otp }),
	});

	if (!res.ok) throw new Error("signup failed");

	const data = await res.json();
	if (data.accessToken) setAccessToken(data.accessToken);
	if (process.env.NODE_ENV !== "production" && data.refreshToken) {
		devRefreshToken = data.refreshToken;
		try {
			if (devRefreshToken)
				sessionStorage.setItem("devRefreshToken", devRefreshToken);
		} catch (e) {}
	}
	return data;
}

export async function logout() {
	try {
		await fetch(`${API_BASE}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
	} catch (e) {
		// ignore network errors; still clear local state
	}

	clearTokens();
}

export async function getMe() {
	const res = await authenticatedFetch(`${API_BASE}/auth/me`, {
		method: "GET",
	});
	if (!res.ok) throw new Error("Failed to get user info");
	return res.json();
}
