import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthUser, useIsAuthenticated, useLogout } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function ProfileScreen() {
	const router = useRouter();
	const user = useAuthUser();
	const isAuthenticated = useIsAuthenticated();
	const logout = useLogout();

	useEffect(() => {
		if (!isAuthenticated) router.push("/");
	}, [user]);

	return (
		<div className="flex flex-col gap-4">
			<Button
				className={` ${user?.role == "USER" && `hidden`}`}
				onClick={() => router.push("/admin")}
			>
				پنل ادمین
			</Button>
			<Button
				className="bg-red-700"
				onClick={async () => {
					try {
						await logout();
						router.push("/");
					} catch (error: any) {
						console.error(error);
					}
				}}
			>
				خروج
			</Button>
		</div>
	);
}
