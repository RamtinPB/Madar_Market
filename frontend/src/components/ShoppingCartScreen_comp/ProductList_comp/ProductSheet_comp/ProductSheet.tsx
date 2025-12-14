"use client";

import { Sheet, SheetContent } from "@/src/components/ui/sheet";

// Subcomponents you created
import { ProductSheetHeader } from "./ProductSheetHeader";
import { ProductSheetAttributes } from "./ProductSheetAttributes";
import { ProductSheetPriceBox } from "./ProductSheetPriceBox";
import { ProductSheetFooter } from "./ProductSheetFooter";

// Types
import { ProduceListCardProps } from "../ProductListCard_comp/ProduceListCard";
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";

interface ProductSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: ProduceListCardProps | null;
}

export default function ProductSheet({
	open,
	onOpenChange,
	product,
}: ProductSheetProps) {
	if (!product) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="flex flex-col justify-between px-4 py-6 h-11/12 pt-10 bg-[#FAFAFA]"
			>
				{/* ----------------------- TOP SECTION ----------------------- */}
				<ScrollArea dir="rtl" className="w-full min-h-0 pb-2">
					<div className="flex flex-col gap-3">
						<ProductSheetHeader title={product.title} image={product.image} />

						<ProductSheetAttributes />
					</div>
					<ScrollBar orientation="vertical" className="z-10" />
				</ScrollArea>
				{/* ----------------------- BOTTOM SECTION ----------------------- */}
				<div className="flex flex-col gap-3">
					<ProductSheetPriceBox sponsorPrice={product.sponsorPrice} />

					<ProductSheetFooter price={product.discountedPrice} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
