"use client";

import Image, { type StaticImageData } from "next/image";

import CheckMark from "@/public/assets/shopping_cart_screen/CheckMark.svg";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */

export interface CategoryItemProps {
	icon: StaticImageData;
	label: string;
	active?: boolean;
	onclick?: () => void;
}

/* ------------------------------------------------------------
 * CATEGORY ITEM COMPONENT
 * Each grid cell: icon container + label
 * ------------------------------------------------------------ */

export default function CategoryItem({
	icon,
	label,
	active = false,
	onclick,
}: CategoryItemProps) {
	return (
		<div className="relative flex flex-col items-center mt-2 overflow-visible">
			{active && <CheckMark className="absolute -translate-y-1.5" />}

			{/* Icon container with gradient background */}
			<div
				onClick={onclick}
				className={`
        flex h-[76px] w-[73px] items-center justify-center
        rounded-xl bg-linear-to-b from-[#FFF7F5] to-[#FFEBE5]
        shadow-xs cursor-pointer
        ${active ? "border-2 border-[#FF6A29]" : "border border-transparent"}
    `}
			>
				{/* Uniform icon sizing */}
				<div className="relative h-[53px] w-[53px] overflow-hidden">
					<Image
						src={icon}
						alt={label}
						fill
						className="object-contain"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				</div>
			</div>

			{/* Label */}
			<span
				className={`mt-1 text-[12px] text-center text-[#333] ${
					active && "font-bold text-[14px] leading-4"
				}`}
			>
				{label}
			</span>
		</div>
	);
}
