import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
	const router = useRouter();
	const { logout } = useAuth();

	return (
		<div className="flex flex-col gap-4">
			<Button className="" onClick={() => router.push("/admin")}>
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
