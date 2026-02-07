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
	SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "../../components/ui/button";
import RightArrowIcon from "../../../public/assets/header/right_arrow.svg";
import { useRouter } from "next/navigation";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@radix-ui/react-accordion";

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
			<Sidebar side="left" className="">
				<SidebarHeader className="border-b">
					<h2 className="text-lg font-semibold p-2">پنل ادمین</h2>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={() => onSelectItem("CatSubCatManager")}
							>
								مدیریت دسته‌ بندی‌ ها
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={() => onSelectItem("CatSubCatManager")}
							>
								مدیریت کاربران ها
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarContent>
			</Sidebar>
		</>
	);
};

export default AdminSidebar;
