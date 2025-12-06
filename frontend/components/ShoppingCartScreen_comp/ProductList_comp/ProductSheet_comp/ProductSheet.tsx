"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

// Subcomponents you created
import { ProductSheetHeader } from "./ProductSheetHeader";
import { ProductSheetAttributes } from "./ProductSheetAttributes";
import { ProductSheetPriceBox } from "./ProductSheetPriceBox";
import { ProductSheetFooter } from "./ProductSheetFooter";

// Types
import { StaticImageData } from "next/image";

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
				<div className="flex flex-col gap-3">
					<ProductSheetHeader title={product.title} image={product.image} />

					<ProductSheetAttributes />
				</div>
				{/* ----------------------- BOTTOM SECTION ----------------------- */}
				<div className="flex flex-col gap-3">
					<ProductSheetPriceBox sponsorPrice={product.sponsorPrice} />

					<ProductSheetFooter oldPrice={product.oldPrice} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
