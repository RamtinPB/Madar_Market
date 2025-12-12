"use client";
import { Card, CardContent } from "@/src/components/ui/card";
import CartImage from "@/public/assets/home_screen/special_products/Cart.png";

import { CartButton } from "../../../ShoppingCartScreen_comp/ProductList_comp/ProductListCard_comp/CartButton";
import { DiscountBadge } from "../../../ShoppingCartScreen_comp/ProductList_comp/ProductListCard_comp/DiscountBadge";
import { SponsorPrice } from "../../../ShoppingCartScreen_comp/ProductList_comp/ProductListCard_comp/SponsorPrice";

export interface AdminProduceListCardProps {
	id: string;
	image?: string;
	title: string;
	description: string;
	discountPercent?: number;
	price?: string;
	discountedPrice: string;
	sponsorPrice?: string;
	onCardClick?: () => void;
}

export default function AdminProduceListCard({
	id,
	image,
	title,
	discountPercent,
	price,
	discountedPrice,
	sponsorPrice,
	onCardClick,
}: AdminProduceListCardProps) {
	return (
		<Card
			className="p-0 cursor-pointer"
			onClick={() => {
				if (onCardClick) onCardClick(); // your drawer trigger
			}}
		>
			<CardContent className="flex flex-col justify-between p-0">
				<div className="flex gap-2 p-3">
					<img
						src={image ?? CartImage.src}
						alt={title}
						className="aspect-square w-1/4 "
					/>
					<div className="flex flex-col w-full justify-between">
						<p className="font-normal text-[#787471] text-[14px] text-wrap mt-2">
							{title}
						</p>
						<div className="flex flex-row justify-between items-center">
							<div className="flex flex-col ">
								<DiscountBadge discount={discountPercent} price={price} />

								{/* NEW PRICE */}
								<div className="mx-2 mt-1 flex items-center gap-1.5 text-[14px] max-[376px]:text-[11px] font-bold text-[#BA400B]">
									<span>{discountedPrice}</span>
									<span>تومان</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<SponsorPrice sponsorPrice={sponsorPrice} />
			</CardContent>
		</Card>
	);
}
