"use client";
import { useState } from "react";
import { products } from "@/components/HomeScreen_comp/SpecialProducts_comp/ProductData";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProduceListHeader } from "./ProduceListHeader";
import { ProduceListGrid } from "./ProduceListGrid";
import ProductSheet from "./ProductSheet_comp/ProductSheet";
import { ProduceListCardProps } from "./ProductListCard_comp/ProduceListCard";

export default function ProduceList() {
	const [selectedProduct, setSelectedProduct] =
		useState<ProduceListCardProps | null>(null);
	const [isDrawerOpen, setDrawerOpen] = useState(false);

	return (
		<section className="flex flex-col gap-5 ">
			<ScrollArea dir="rtl" className="w-full whitespace-nowrap pb-2">
				<ProduceListHeader />
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
			<ScrollArea dir="rtl" className="w-full whitespace-nowrap pb-2">
				<ProduceListGrid
					products={products}
					onCardClick={(p) => {
						setSelectedProduct(p);
						setDrawerOpen(true);
					}}
				/>

				<ScrollBar orientation="vertical" className="hidden" />
			</ScrollArea>
			<ProductSheet
				open={isDrawerOpen}
				onOpenChange={setDrawerOpen}
				product={selectedProduct}
			/>
		</section>
	);
}
