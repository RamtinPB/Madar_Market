import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "./ProductCard";
import ViewAllCard from "./ViewAllCard";

import ShoppingCart from "@/public/assets/home_screen/special_products/Cart.png";
import MachhiatoCafe from "@/public/assets/home_screen/special_products/machhiato.png";
import OliveOil from "@/public/assets/home_screen/special_products/olive_oil.png";
import Qharaqhorum from "@/public/assets/home_screen/special_products/qh.png";

export default function SpecialProducts() {
	// --- PRODUCT LIST ---
	const products = [
		{
			image: OliveOil,
			title: "روغن زیتون بکر کریستال - 5 لیتر ",
			discount: 10,
			oldPrice: "40,000",
			newPrice: "3,700,000",
		},
		{
			image: Qharaqhorum,
			title: "کشک قره قروتی ممتاز حس خوب - 500 گرم",
			discount: 10,
			oldPrice: "40,000",
			newPrice: "3,700,000",
		},
		{
			image: ShoppingCart,
			title: "روغن زیتون بکر کریستال - 5 لیتر ",
			discount: 10,
			oldPrice: "40,000",
			newPrice: "3,700,000",
		},
		{
			image: Qharaqhorum,
			title: "کشک قره قروتی ممتاز حس خوب - 500 گرم",
			discount: 10,
			oldPrice: "40,000",
			newPrice: "3,700,000",
		},
		{
			image: OliveOil,
			title: "روغن زیتون بکر کریستال - 5 لیتر ",
			discount: 10,
			oldPrice: "40,000",
			newPrice: "3,700,000",
		},
		{
			image: MachhiatoCafe,
			title: "پودر ماکیاتو ونزکافه - 25 گرم بسته 20 عددی",
			discount: 22,
			oldPrice: "365,000",
			newPrice: "292,900",
		},
		{
			image: ShoppingCart,
			title: "روغن زیتون بکر کریستال - 5 لیتر ",
			discount: 10,
			oldPrice: "40,000",
			newPrice: "3,700,000",
		},
	];

	return (
		<div className="flex flex-col gap-2 mt-4">
			{/* HEADER */}
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-[#BA400B] font-bold text-base">محصولات ویژه</h1>
				<span className="text-[#C15323] font-medium text-base">
					بهترین پیشنهادات روز
				</span>
			</div>

			{/* CONTENT */}
			<ScrollArea className="w-full whitespace-nowrap pb-2" dir="rtl">
				<div className="grid grid-flow-col grid-rows-2 auto-cols-[156px] gap-3">
					{/* LOOPED PRODUCT CARDS */}
					{products.map((product, index) => (
						<ProductCard
							key={index}
							image={product.image}
							title={product.title}
							discount={product.discount}
							oldPrice={product.oldPrice}
							newPrice={product.newPrice}
						/>
					))}

					{/* LAST ITEM */}
					<ViewAllCard />
				</div>

				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</div>
	);
}
