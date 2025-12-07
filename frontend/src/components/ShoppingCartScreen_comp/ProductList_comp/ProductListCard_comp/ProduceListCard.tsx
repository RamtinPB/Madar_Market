"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

import { CartButton } from "./CartButton";
import { DiscountBadge } from "./DiscountBadge";
import { SponsorPrice } from "./SponsorPrice";

export interface ProduceListCardProps {
	image?: StaticImageData;
	title: string;
	discount?: number;
	oldPrice?: string;
	newPrice: string;
	sponsorPrice?: string;
	onCardClick?: () => void;
}

export default function ProduceListCard({
	image,
	title,
	discount,
	oldPrice,
	newPrice,
	sponsorPrice,
	onCardClick,
}: ProduceListCardProps) {
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
								<DiscountBadge discount={discount} oldPrice={oldPrice} />

								{/* NEW PRICE */}
								<div className="mx-2 mt-1 flex items-center gap-1.5 text-[14px] max-[376px]:text-[11px] font-bold text-[#BA400B]">
									<span>{newPrice}</span>
									<span>تومان</span>
								</div>
							</div>

							<CartButton title={title} />
						</div>
					</div>
				</div>
				<SponsorPrice sponsorPrice={sponsorPrice} />
			</CardContent>
		</Card>
	);
}
