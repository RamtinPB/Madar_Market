"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { bootstrapAuth } from "@/lib/auth/bootstrap";

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
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					fontFamily: "var(--font-vazir)",
					direction: "rtl",
				}}
			>
				در حال بارگذاری...
			</div>
		);
	}

	return <>{children}</>;
}
