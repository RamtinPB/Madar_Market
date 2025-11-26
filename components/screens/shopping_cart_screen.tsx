import CountdownAd from "../home_screen/CountdownAd";
import ProduceList from "../shopping_cart_screen/product_list/ProduceList";
import ScrollCategories from "../shopping_cart_screen/ScrollCategories";
import ScrollProducts from "../shopping_cart_screen/ScrollCategories";
import SubCategories from "../shopping_cart_screen/SubCategories";

export default function shopping_cart_screen() {
	return (
		<section className="flex flex-col w-full gap-5 mb-9">
			{/* Timer-Based Ad */}
			<CountdownAd />

			<ScrollCategories />

			<SubCategories />

			<ProduceList />
		</section>
	);
}
