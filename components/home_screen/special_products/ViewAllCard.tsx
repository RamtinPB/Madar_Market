"use client";

import Image, { type StaticImageData } from "next/image";
import ArrowLeft from "@/public/assets/home_screen/special_products/arrow.png";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */
interface ViewAllCardProps {
	onClick?: () => void;
}

/* ------------------------------------------------------------
 * VIEW ALL CARD
 * Last card in SpecialProducts — navigates user to full list.
 * ------------------------------------------------------------ */
export default function ViewAllCard({ onClick }: ViewAllCardProps) {
	return (
		<button
			onClick={onClick}
			className="
				flex h-[299px] w-[156px]
				flex-col items-center justify-center
				rounded-xl border bg-white shadow-sm
				transition-all duration-150
				hover:bg-zinc-50 active:scale-95
			"
		>
			<Image
				src={ArrowLeft as StaticImageData}
				alt="مشاهده همه محصولات"
				className="h-16 w-[74px]"
			/>
		</button>
	);
}
