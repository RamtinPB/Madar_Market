"use client";
import { useEffect, useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProduceListHeader } from "./ProduceListHeader";
import { ProduceListGrid } from "./ProduceListGrid";
import ProductSheet from "./ProductSheet/ProductSheet";
import { ProduceListCardProps } from "./ProductListCard/ProduceListCard";
import apiFetch from "@/lib/api/fetcher";

interface ProduceListProps {
	subCategoryId: string | undefined;
}

export default function ProduceList({ subCategoryId }: ProduceListProps) {
	const [selectedProduct, setSelectedProduct] =
		useState<ProduceListCardProps | null>(null);
	const [isDrawerOpen, setDrawerOpen] = useState(false);
	const [products, setProducts] = useState<ProduceListCardProps[]>([]);

	useEffect(() => {
		if (!subCategoryId) {
			setProducts([]);
			return;
		}
		// fetch products from backend
		const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
		apiFetch(`${API_BASE}/subcategories/${subCategoryId}/get-all-products`)
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) {
					const mapped = data.map((c: any) => ({
						id: c.id,
						image:
							c.images && c.images.length > 0
								? `${API_BASE}${c.images[0].path}`
								: undefined,
						title: c.title,
						description: c.description,
						discountPercent: c.discountPercent,
						price: c.price?.toString(),
						discountedPrice: c.discountedPrice?.toString(),
						sponsorPrice: c.sponsorPrice?.toString(),
					}));

					setProducts(mapped);
				} else {
					setProducts([]);
				}
			})

			.catch((e) => {
				console.warn("Failed to fetch products from backend:", e);
				setProducts([]);
			});
	}, [subCategoryId]);

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
