import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarInset,
	SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { Button } from "../ui/button";
import RightArrowIcon from "@/public/assets/header/right_arrow.svg";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
	children: React.ReactNode;
	onSelectItem: (item: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
	children,
	onSelectItem,
}) => {
	const router = useRouter();
	return (
		<>
			<Sidebar side="left">
				<SidebarHeader className="border-b">
					<h2 className="text-lg font-semibold p-2">پنل ادمین</h2>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={() => onSelectItem("CategoriesManager")}
							>
								مدیریت محصولات و دسته بندی ها
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<header className="flex justify-between h-16 shrink-0 items-center border-b px-6">
					<Button
						variant="ghost"
						className="h-8 w-8 p-0"
						onClick={() => router.push("/")}
					>
						<RightArrowIcon className="w-fit! h-fit!" />
					</Button>
					<SidebarTrigger className="-ml-1" />
				</header>
				{children}
			</SidebarInset>
		</>
	);
};

export default AdminSidebar;
