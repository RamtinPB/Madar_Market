import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import Image, { type StaticImageData } from "next/image";

import PlusIcon from "@/public/assets/shopping_cart_screen/plus.svg";
import TrashIcon from "@/public/assets/shopping_cart_screen/trash.svg";
import { useState } from "react";
import { useCartStore } from "@/data_store/useCartStore";

/* ------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------ */
export interface ProduceListCardProps {
	image?: StaticImageData;
	title: string;
	discount?: number;
	oldPrice?: string;
	newPrice: string;
	sponsorPrice?: string;
	onCardClick?: () => void;
}

/* ------------------------------------------------------------
 * PRODUCT CARD COMPONENT
 * ------------------------------------------------------------ */

export default function ProduceListCard({
	image,
	title,
	discount,
	oldPrice,
	newPrice,
	sponsorPrice,
	onCardClick,
}: ProduceListCardProps) {
	const [count, setCount] = useState(0);
	const inCart = count > 0;
	const setItemCount = useCartStore((s) => s.setItemCount);

	return (
		<Card
			className="p-0 cursor-pointer"
			onClick={() => {
				if (onCardClick) onCardClick(); // your drawer trigger
			}}
		>
			<CardContent className="flex flex-col justify-between p-0">
				<div className="flex gap-2 p-3">
					<Image
						src={image ?? ""}
						alt={title}
						className="aspect-square w-1/4 "
					/>
					<div className="flex flex-col w-full justify-between">
						<p className="font-normal text-[#787471] text-[14px] text-wrap mt-2">
							{title}
						</p>
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-col ">
								{/* DISCOUNT ROW */}
								{discount && oldPrice && (
									<div className="mx-2 mt-1 flex items-center gap-1.5">
										{/* OLD PRICE */}
										<div className="flex items-center text-[10px] max-[376px]:text-[8px] font-medium text-[#787471] line-through">
											<span>{oldPrice}</span>
											<span>تومان</span>
										</div>

										{/* DISCOUNT BADGE */}
										<span className="rounded-[20px] bg-[#C50F1F] px-1 py-0.5 text-[9px] max-[376px]:text-[8px] font-normal text-white">
											%{discount}
										</span>
									</div>
								)}
								{/* NEW PRICE */}
								<div className="mx-2 mt-1 flex items-center gap-1.5 text-[14px] max-[376px]:text-[11px] font-bold text-[#BA400B]">
									<span>{newPrice}</span>
									<span>تومان</span>
								</div>
							</div>
							{!inCart ? (
								<Button
									onClick={(e) => {
										e.stopPropagation(); // prevent parent click
										const updated = 1;
										setCount(updated);
										setItemCount(title, updated);
									}}
									className=" h-10 rounded-[20px] bg-[#F5F2EF] p-4 text-[16px] font-medium text-[#787471]"
								>
									افزودن به سبد
								</Button>
							) : (
								<ButtonGroup
									onClick={(e) => e.stopPropagation()} // stop clicks from bubbling
									orientation={"horizontal"}
									dir="ltr"
									className="h-10 max-[376px]:h-9 items-center bg-[#F7F7F7] border border[#F3F0EC] rounded-[20px] z-10"
								>
									<Button
										onClick={() => {
											setCount(0);
											setItemCount(title, 0);
										}}
										className="bg-transparent"
									>
										<TrashIcon className="w-fit! h-fit!" />
									</Button>
									<span>{count}</span>
									<Button
										onClick={() => {
											const updated = count + 1;
											setCount(updated);
											setItemCount(title, updated);
										}}
										className="bg-transparent"
									>
										<PlusIcon className="w-fit! h-fit!" />
									</Button>
								</ButtonGroup>
							)}
						</div>
					</div>
				</div>
				{sponsorPrice && (
					<div className="flex flex-row justify-between items-center text-center rounded-b-2xl bg-[#FFEDE5] px-6 pb-2 pt-1.5">
						<span className="text-[14px]  font-bold text-[#BA400B]">
							قیمت با حامی کارت
						</span>
						<div className="flex items-center gap-1.5 text-[14px] font-bold text-[#BA400B]">
							<span>{sponsorPrice}</span>
							<span>تومان</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
