"use client";
import { Button } from "../../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import CardIcon from "@/public/assets/shopping_cart_screen/card.svg";
import DiscountIcon from "@/public/assets/shopping_cart_screen/receipt-discount.svg";
import SwapArrowIcon from "@/public/assets/shopping_cart_screen/arrow-swap.svg";

export function ProduceListHeader() {
	return (
		<header className="flex items-center gap-2 justify-between">
			<Select dir="rtl">
				<SelectTrigger className="border-[#F5F2EF]! rounded-xl max-[376px]:py-0 max-[376px]:px-1!">
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
				<Button className="items-center text-[#787471] bg-[#F7F7F7] rounded-xl">
					<CardIcon />
					<span>تخفیفات</span>
				</Button>
				<Button className="items-center text-[#787471] bg-[#F7F7F7] rounded-xl">
					<DiscountIcon />
					<span>حامی کارت</span>
				</Button>
			</div>
		</header>
	);
}
