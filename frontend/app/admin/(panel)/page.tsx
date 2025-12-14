"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/src/components/Admin/Admin_Sidebar";
import CategoriesManager from "@/src/components/Admin/CategoryManager/CategoriesManager";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import CatManager from "@/src/components/Admin/Cats_SubCats_Products_Manager/CatManager/CatManager";

export default function Page() {
	const router = useRouter();
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const { user } = useAuth();

	// useEffect(() => {
	// 	if (!user || user.role !== "SUPER_ADMIN") router.push("/");
	// }, [user]);

	const handleSelectItem = (item: string) => {
		setSelectedItem(item);
	};

	return (
		<SidebarProvider className="">
			{/* MAIN CONTENT WITH SIDEBAR */}
			<AdminSidebar onSelectItem={handleSelectItem}>
				{/* Contents section */}
				<div className="p-6">
					{selectedItem === "CategoriesManager" && <CategoriesManager />}
					{selectedItem === "CatManager" && <CatManager />}
					{!selectedItem && (
						<div className="text-center text-gray-500">
							گزینه ای از منو انتخاب کنید.
						</div>
					)}
				</div>
			</AdminSidebar>
		</SidebarProvider>
	);
}
