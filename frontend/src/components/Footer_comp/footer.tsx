import NavItem from "./NavItem";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

import HomeIcon from "@/public/assets/footer/home.svg";
import ReceiptIcon from "@/public/assets/footer/receipt.svg";
import BasketIcon from "@/public/assets/header/basket.svg";
import ProfileIcon from "@/public/assets/footer/profile.svg";
import LoginIcon from "@/public/assets/footer/right-to-bracket-solid-full.svg";

type TabKey = "home" | "orders" | "profile" | "basket" | "login";

type NavTab = Exclude<TabKey, "login">;

interface FooterProps {
	activeTab: NavTab;
	onChangeTab: (tab: NavTab) => void;
}

/* ------------------------------------------------------------
 * CONFIG ARRAY → Single Source of Truth
 * ------------------------------------------------------------ */
const NAV_ITEMS: { tab: TabKey; label: string; icon: any }[] = [
	{ tab: "home", label: "خانه", icon: HomeIcon },
	{ tab: "basket", label: "سبد خرید", icon: BasketIcon },
	{ tab: "orders", label: "سفارش ها", icon: ReceiptIcon },
];

/* ------------------------------------------------------------
 * FOOTER CONTAINER
 * ------------------------------------------------------------ */
export function Footer({ activeTab, onChangeTab }: FooterProps) {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	const itemsToRender = NAV_ITEMS.concat([
		isAuthenticated
			? { tab: "profile", label: "پروفایل", icon: ProfileIcon }
			: { tab: "login", label: "ورود", icon: LoginIcon },
	]);

	return (
		<footer className="fixed bottom-0 left-0 z-50 flex h-[74px] w-full items-center justify-evenly border-t bg-white px-4">
			{itemsToRender.map((item) => (
				<NavItem
					key={item.tab}
					icon={item.icon}
					label={item.label}
					active={activeTab === item.tab}
					onClick={() => {
						if (item.tab === "login") {
							router.push("/login"); // 🔥 Go to login page
						} else {
							onChangeTab(item.tab); // normal tab switching
						}
					}}
				/>
			))}
		</footer>
	);
}
