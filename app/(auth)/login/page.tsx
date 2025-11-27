"use client";
import { useRouter } from "next/navigation";

import RightArrowIcon from "@/public/assets/header/right_arrow.svg";
import LoginLeft from "@/public/assets/login/login_left.png";
import LoginRight from "@/public/assets/login/login_right.png";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
	const router = useRouter();

	return (
		<div className="relative flex h-screen w-full flex-col bg-white dark:bg-black overflow-hidden">
			{/* HEADER */}
			<header className="flex h-[72px] w-full items-center border-b px-6">
				<Button
					variant="ghost"
					className="h-8 w-8 p-0"
					onClick={() => router.push("/")}
				>
					<RightArrowIcon className="h-8! w-8!" />
				</Button>
			</header>

			{/* MAIN CONTENT (fills remaining space) */}
			<main className="flex-1 relative z-20 px-6 pt-6">
				{/* Put all login form, texts, buttons here */}
			</main>

			{/* LEFT BOTTOM DECORATION */}
			<Image
				src={LoginLeft}
				alt=""
				width={308}
				height={308}
				className="absolute bottom-0 left-0 pointer-events-none select-none z-10"
			/>

			{/* RIGHT BOTTOM DECORATION */}
			<Image
				src={LoginRight}
				alt=""
				width={301}
				height={301}
				className="absolute bottom-0 right-0 pointer-events-none select-none z-10"
			/>
		</div>
	);
}
