"use client";

import { useEffect, useState } from "react";
import { getAccessToken, onAuthChange } from "@/lib/api/auth";

export function useAuthState() {
	const [loggedIn, setLoggedIn] = useState<boolean>(() => !!getAccessToken());

	useEffect(() => {
		const unsub = onAuthChange((token) => {
			setLoggedIn(!!token);
		});
		// initial state already set from memory token
		return () => unsub();
	}, []);

	return { loggedIn };
}

export function getUserRole() {
	const [userRole, setUserRole] = useState<string>("");

	useEffect(() => {}, []);

	return userRole;
}
