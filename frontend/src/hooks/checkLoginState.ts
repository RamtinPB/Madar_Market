"use client";

import { useEffect, useState } from "react";

export function useAuthState() {
	const [loggedIn, setLoggedIn] = useState<boolean>(false);

	useEffect(() => {
		function handleStorage() {
			const token = sessionStorage.getItem("accessToken");
			setLoggedIn(!!token);
		}

		window.addEventListener("storage", handleStorage);
		handleStorage();
	}, []);

	return { loggedIn };
}

export function getUserRole() {
	const [userRole, setUserRole] = useState<string>("");

	useEffect(() => {}, []);

	return userRole;
}
