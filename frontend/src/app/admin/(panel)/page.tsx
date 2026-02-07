"use client";

import { useState } from "react";
import AdminSidebar from "@/features/Admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthUser, useIsAuthenticated, useUserRole } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import CatSubCatManager from "@/features/Admin/catSubcatManager/CatSubCatManager";

export default function Page() {
	const router = useRouter();
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const user = useAuthUser();
	const isAuthenticated = useIsAuthenticated();
	const userRole = useUserRole();

	const handleSelectItem = (item: string) => {
		setSelectedItem(item);
	};

	if (!isAuthenticated) {
		return <div>Please log in to access this page.</div>;
	}

	if (userRole !== "SUPER_ADMIN") {
		return <div>Insufficient permissions. Required: SUPER_ADMIN</div>;
	}

	return (
		<SidebarProvider className="">
			{/* MAIN CONTENT WITH SIDEBAR */}
			<AdminSidebar onSelectItem={handleSelectItem}>
				{/* Contents section */}
				<div className="p-6">
					{selectedItem === "CatSubCatManager" && <CatSubCatManager />}
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
