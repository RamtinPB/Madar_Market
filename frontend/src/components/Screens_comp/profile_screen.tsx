import { logout } from "@/lib/api/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function profile_screen() {
	const router = useRouter();
	return (
		<div>
			<Button
				className="bg-red-700"
				onClick={async () => {
					try {
						await logout();
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
