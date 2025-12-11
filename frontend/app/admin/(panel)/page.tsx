"use client";

import { useState } from "react";
import AdminSidebar from "@/src/components/Admin/Admin_Sidebar";
import CategoriesManager from "@/src/components/Admin/CategoriesManager";
import { SidebarProvider } from "@/src/components/ui/sidebar";

export default function Page() {
	const [selectedItem, setSelectedItem] = useState<string | null>(null);

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
