import { useState } from "react";
import Admin_ScrollCategories from "./Admin_ScrollCategories";

export default function CategoriesManager() {
	const [category, setCategory] = useState<{
		id: string;
		icon: string;
		label: string;
	}>();
	return (
		<div>
			<Admin_ScrollCategories onSelectCategory={(cat) => setCategory(cat)} />
		</div>
	);
}
