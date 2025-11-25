"use client";

import Image, { type StaticImageData } from "next/image";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */

export interface CategoryItemProps {
	icon: StaticImageData;
	label: string;
}

/* ------------------------------------------------------------
 * CATEGORY ITEM COMPONENT
 * Each grid cell: icon container + label
 * ------------------------------------------------------------ */

export default function CategoryItem({ icon, label }: CategoryItemProps) {
	return (
		<div className="flex flex-col items-center">
			{/* Icon container with gradient background */}
			<div
				className="
				flex h-[76px] w-[73px] items-center justify-center
				rounded-xl bg-linear-to-b from-[#FFF7F5] to-[#FFEBE5]
				shadow-xs
			"
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
			<span className="mt-1 text-[12px] text-center text-[#333]">{label}</span>
		</div>
	);
}
