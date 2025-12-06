import CountdownAd from "../HomeScreen_comp/CountdownAd";
import ProduceList from "../ShoppingCartScreen_comp/ProductList_comp/ProduceList";
import ScrollCategories from "../ShoppingCartScreen_comp/ScrollCategories";
import SubCategories from "../ShoppingCartScreen_comp/SubCategories";

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
