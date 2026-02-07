import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CountdownAd from "../Home/CountdownAd";
import ProduceList from "../ShoppingCartPage/ProductList/ProduceList";
import ScrollCategories from "../ShoppingCartPage/ScrollCategories";
import SubCategories from "../ShoppingCartPage/SubCategories";

export default function CartScreen() {
	const searchParams = useSearchParams();
	const categoryId = searchParams.get("categoryId");

	const [category, setCategory] = useState<{
		id: string;
		icon: string;
		label: string;
	}>();

	const [subCategory, setSubCategory] = useState<{
		id: string;
		icon: string;
		label: string;
	}>();

	useEffect(() => {
		setSubCategory(undefined);
	}, [category?.id]);

	return (
		<section className="flex flex-col w-full gap-5 mb-9">
			{/* Timer-Based Ad */}
			<CountdownAd />

			<ScrollCategories
				onSelectCategory={(cat) => setCategory(cat)}
				initialSelectedId={categoryId}
			/>

			<SubCategories
				categoryId={category?.id}
				onSelectSubCategory={(subcat) => setSubCategory(subcat)}
			/>

			<ProduceList subCategoryId={subCategory?.id} />
		</section>
	);
}
