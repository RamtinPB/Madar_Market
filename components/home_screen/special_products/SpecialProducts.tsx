"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
import ViewAllCard from "./ViewAllCard";

import { products } from "./ProductData";

import ShoppingCart from "@/public/assets/home_screen/special_products/Cart.png";

/* ------------------------------------------------------------
 *  SPECIAL PRODUCTS SECTION
 * ------------------------------------------------------------ */

export default function SpecialProducts() {
	return (
		<section className="mt-4 flex flex-col gap-5">
			{/* HEADER */}
			<header className="flex items-center justify-between">
				<h1 className="text-base font-bold text-[#BA400B]">محصولات ویژه</h1>

				<span className="text-base font-medium text-[#C15323]">
					بهترین پیشنهادات روز
				</span>
			</header>

			{/* CONTENT GRID (SCROLLABLE) */}
			<ScrollArea dir="rtl" className="w-full whitespace-nowrap pb-2">
				<div className="grid grid-flow-col grid-rows-2 auto-cols-[156px] gap-3">
					{products.map((p, i) => (
						<ProductCard
							key={i}
							image={p.image ?? ShoppingCart} // use ShoppingCart if p.image is null
							title={p.title}
							discount={p.discount}
							oldPrice={p.oldPrice}
							newPrice={p.newPrice}
						/>
					))}

					{/* FINAL ITEM */}
					<ViewAllCard />
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
