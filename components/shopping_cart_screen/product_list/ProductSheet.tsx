"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { StaticImageData } from "next/image";
import { BannerCarousel } from "@/components/home_screen/BannerCarousel";
import Close from "@/public/assets/shopping_cart_screen/close.svg";
// -------------------------------
// Props Types
// -------------------------------
interface Product {
	title: string;
	image?: StaticImageData;
	newPrice: string;
	oldPrice?: string;
	discount?: number;
	sponsorPrice?: string;
}

interface ProductSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: Product | null;
}

// -------------------------------
// Product Sheet Component
// -------------------------------
export default function ProductSheet({
	open,
	onOpenChange,
	product,
}: ProductSheetProps) {
	if (!product) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="bottom" className="px-4 py-6 h-11/12 pt-10">
				<BannerCarousel
					height="147"
					banners={product.image ? [product.image] : []}
					imageObject="contain"
				/>
				<SheetTitle>{product.title}</SheetTitle>

				<div className="flex flex-col gap-4">
					{/* You will edit this section later */}
					<div className="text-lg">
						<p>قیمت: {product.newPrice} تومان</p>
						{product.sponsorPrice && (
							<p>حامی کارت: {product.sponsorPrice} تومان</p>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
