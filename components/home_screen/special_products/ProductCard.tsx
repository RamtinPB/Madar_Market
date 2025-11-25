"use client";

import Image, { type StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */
export interface ProductCardProps {
	image: StaticImageData;
	title: string;
	discount?: number;
	oldPrice?: string;
	newPrice: string;
}

/* ------------------------------------------------------------
 * PRODUCT CARD COMPONENT
 * ------------------------------------------------------------ */
export default function ProductCard({
	image,
	title,
	discount,
	oldPrice,
	newPrice,
}: ProductCardProps) {
	return (
		<div className="flex h-[299px] w-[156px] flex-col rounded-t-[12px] rounded-b-[20px] border bg-white text-wrap shadow-sm">
			{/* IMAGE */}
			<div className="relative my-2 mx-auto h-36 w-36">
				<Image
					src={image}
					alt={title}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="rounded-lg object-cover"
				/>
			</div>

			{/* TITLE */}
			<p className="mx-2 my-1 text-[12px] font-medium leading-[18px] text-[#4F4C4B]">
				{title}
			</p>

			{/* DISCOUNT ROW */}
			{discount && oldPrice && (
				<div className="mx-2 mt-1 flex items-center gap-1.5">
					{/* OLD PRICE */}
					<div className="flex items-center text-[10px] font-medium text-[#787471] line-through">
						<span>{oldPrice}</span>
						<span>تومان</span>
					</div>

					{/* DISCOUNT BADGE */}
					<span className="rounded-[20px] bg-[#C50F1F] px-1 py-0.5 text-[9px] font-normal text-white">
						%{discount}
					</span>
				</div>
			)}

			{/* NEW PRICE */}
			<div className="mx-2 mt-1 flex items-center gap-1.5 text-[14px] font-bold text-[#BA400B]">
				<span>{newPrice}</span>
				<span>تومان</span>
			</div>

			{/* ADD-TO-CART BUTTON */}
			<Button className="mt-auto h-8 w-full rounded-[20px] bg-[#F5F2EF] p-2 text-[16px] font-medium text-[#787471]">
				افزودن به سبد
			</Button>
		</div>
	);
}
