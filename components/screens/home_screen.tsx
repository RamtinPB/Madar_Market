import { BannerCarousel } from "../home_screen/BannerCarousel";
import Categories from "../home_screen/Categories";
import CountdownAd from "../home_screen/CountdownAd";
import SearchBar from "../home_screen/SearchBar";
import SpecialProducts from "../home_screen/SpecialProducts";

export default function home_screen() {
	return (
		<div className="flex flex-col gap-5 w-full">
			<SearchBar />

			<BannerCarousel />

			<CountdownAd />

			<Categories />

			<SpecialProducts />
		</div>
	);
}
