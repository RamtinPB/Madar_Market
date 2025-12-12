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
		<div className="flex flex-col gap-2">
			<AdminScrollCategories onSelectCategory={(cat) => setCategory(cat)} />

			{category?.id && (
				<AdminSubCategories
					categoryId={category?.id}
					onSelectSubCategory={(subcat) => setSubCategory(subcat)}
				/>
			)}

			{subCategory?.id && <AdminProductList subCategoryId={subCategory?.id} />}
		</div>
	);
}
