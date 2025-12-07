"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";

import { Header } from "@/src/components/Header_comp/header";
import { Footer } from "@/src/components/Footer_comp/footer";

// Screens
import HomeScreen from "@/src/components/Screens_comp/home_screen";
import OrdersScreen from "@/src/components/Screens_comp/orders_screen";
import ProfileScreen from "@/src/components/Screens_comp/profile_screen";
import ShoppingCartScreen from "@/src/components/Screens_comp/shopping_cart_screen";
import { getAccessToken } from "@/src/lib/api/auth";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */

type TabKey = "home" | "orders" | "profile" | "basket";

/* ------------------------------------------------------------
 * SCREEN REGISTRY
 * Centralized mapping between tab keys and screen components.
 * This avoids switch statements and makes adding new screens trivial.
 * ------------------------------------------------------------ */

const SCREEN_MAP: Record<TabKey, ReactElement> = {
	home: <HomeScreen />,
	orders: <OrdersScreen />,
	profile: <ProfileScreen />,
	basket: <ShoppingCartScreen />,
};

/* ------------------------------------------------------------
 * MAIN PAGE COMPONENT
 * ------------------------------------------------------------ */

export default function HomePage() {
	const [activeTab, setActiveTab] = useState<TabKey>("home");
	console.log(getAccessToken());

	/**
	 * Screen rendering is memoized to avoid unnecessary rerenders.
	 */
	const currentScreen = useMemo(() => SCREEN_MAP[activeTab], [activeTab]);

	return (
		<>
			{/* HEADER */}
			<Header />

			{/* MAIN CONTENT WRAPPER */}
			<section className="mt-[84px] mb-[74px] flex w-full justify-center px-6 max-[376px]:px-2.5 max-[321px]:px-1">
				{currentScreen}
			</section>

			{/* FOOTER NAVIGATION */}
			<Footer activeTab={activeTab} onChangeTab={setActiveTab} />
		</>
	);
}
