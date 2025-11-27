"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer/footer";

// Screens
import HomeScreen from "@/components/screens/home_screen";
import OrdersScreen from "@/components/screens/orders_screen";
import ProfileScreen from "@/components/screens/profile_screen";
import ShoppingCartScreen from "@/components/screens/shopping_cart_screen";

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

	/**
	 * Screen rendering is memoized to avoid unnecessary rerenders.
	 */
	const currentScreen = useMemo(() => SCREEN_MAP[activeTab], [activeTab]);

	return (
		<div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
			<main className="relative flex min-h-screen w-full max-w-3xl flex-col bg-white dark:bg-black">
				{/* HEADER */}
				<Header />

				{/* MAIN CONTENT WRAPPER */}
				<section className="mt-3 mb-[74px] flex w-full justify-center px-6">
					{currentScreen}
				</section>

				{/* FOOTER NAVIGATION */}
				<Footer activeTab={activeTab} onChangeTab={setActiveTab} />
			</main>
		</div>
	);
}
