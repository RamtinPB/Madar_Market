import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function profile_screen() {
	const router = useRouter();
	const { logout } = useAuth();

	return (
		<div>
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
