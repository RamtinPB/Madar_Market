import { Button } from "../../ui/button";

import CardIcon from "@/public/assets/shopping_cart_screen/card.svg";
import DiscountIcon from "@/public/assets/shopping_cart_screen/receipt-discount.svg";
import SwapArrowIcon from "@/public/assets/shopping_cart_screen/arrow-swap.svg";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import ProduceListCard from "./ProduceListCard";
import { products } from "@/components/home_screen/special_products/ProductData";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShoppingCart from "@/public/assets/home_screen/special_products/Cart.png";
import CustomSpinner from "../CustomSpinner";

export default function ProduceList() {
	return (
		<section className="mt-4 flex flex-col gap-5">
			<header className="flex items-center justify-between">
				<Select dir="rtl">
					<SelectTrigger className="border-[#F5F2EF]! rounded-xl">
						<SwapArrowIcon />
						<SelectValue placeholder="مرتب سازی" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="MostSold">پرفروش ترین</SelectItem>
						<SelectItem value="HighestDiscount">بیشترین تخفیف</SelectItem>
						<SelectItem value="Newest">جدید ترین</SelectItem>
						<SelectItem value="Cheepest">ارزان ترین</SelectItem>
						<SelectItem value="MostExpensive">گران ترین</SelectItem>
					</SelectContent>
				</Select>
				<div className="flex gap-2">
					<Button className="items-center text-[#787471] bg-[#F7F7F7] border border[#F3F0EC] rounded-xl">
						<CardIcon />
						<span>تخفیفات</span>
					</Button>
					<Button className="items-center text-[#787471] bg-[#F7F7F7] border border[#F3F0EC] rounded-xl">
						<DiscountIcon />
						<span>حامی کارت</span>
					</Button>
				</div>
			</header>
			<ScrollArea dir="rtl" className="w-full whitespace-nowrap pb-2">
				<div className="flex flex-col items-center gap-3">
					{products.map((p, i) => (
						<ProduceListCard
							key={i}
							image={p.image ?? ShoppingCart} // use ShoppingCart if p.image is null
							title={p.title}
							discount={p.discount}
							oldPrice={p.oldPrice}
							newPrice={p.newPrice}
							sponsorPrice={p.sponsorPrice}
						/>
					))}
					<CustomSpinner />
				</div>
				<ScrollBar orientation="vertical" className="hidden" />
			</ScrollArea>
		</section>
	);
}
