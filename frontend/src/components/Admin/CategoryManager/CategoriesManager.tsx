import { useEffect, useState } from "react";
import AdminScrollCategories from "./CategoriesScroll/AdminScrollCategories";
import AdminSubCategories from "./SubCategoriesScroll/AdminSubCategories";
import AdminProductList from "./ProductsScroll/AdminProduceList";

export default function CategoriesManager() {
	const [category, setCategory] = useState<{
		id: string;
		icon: string;
		label: string;
	} | null>(null);

	const [subCategory, setSubCategory] = useState<{
		id: string;
		icon: string;
		label: string;
	} | null>(null);

	useEffect(() => {
		setSubCategory(null);
	}, [category?.id]);

	return (
		<div>
			<AdminScrollCategories onSelectCategory={(cat) => setCategory(cat)} />

			<AdminSubCategories
				categoryId={category?.id}
				onSelectSubCategory={(subcat) => setSubCategory(subcat)}
			/>

			<AdminProductList subCategoryId={subCategory?.id} />
		</div>
	);
}
