"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
	login as apiLogin,
	signup as apiSignup,
	logout as apiLogout,
} from "@/src/lib/api/auth";
import { getAccessToken, setAccessToken } from "@/src/lib/api/auth";
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
		const token = sessionStorage.getItem("accessToken");

		if (token) {
			// restore the in-memory token
			setAccessToken(token);

			// optionally fetch user profile
			// but for now just mark authenticated
			setUser({});
		}

		setLoading(false);
	}, []);

	// -----------------------------
	// LOGIN FLOW
	// -----------------------------
	const login = async (phone: string, pass: string, otp: string) => {
		const { user, accessToken } = await apiLogin(phone, pass, otp);

		// store access token
		sessionStorage.setItem("accessToken", accessToken);
		setAccessToken(accessToken);

		setUser(user);
	};

	// -----------------------------
	// SIGNUP FLOW
	// -----------------------------
	const signup = async (phone: string, pass: string, otp: string) => {
		const res = await apiSignup(phone, pass, otp);
		setUser(res.user);
	};

	// -----------------------------
	// LOGOUT FLOW
	// -----------------------------
	const logout = async () => {
		await apiLogout();
		setUser(null);
		sessionStorage.removeItem("accessToken");
		setAccessToken(null);
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
