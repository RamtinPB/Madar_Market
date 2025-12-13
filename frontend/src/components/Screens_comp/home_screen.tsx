import SearchBar from "../HomeScreen_comp/SearchBar";
import { BannerCarousel } from "../HomeScreen_comp/BannerCarousel";
import CountdownAd from "../HomeScreen_comp/CountdownAd";
import Categories from "../HomeScreen_comp/Categories_comp/Categories";
import SpecialProducts from "../HomeScreen_comp/SpecialProducts_comp/SpecialProducts";
import WatchAd from "../HomeScreen_comp/WatchAd";

/* ------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------ */

export default function HomeScreen() {
	const banners = [
		"/public/carousel/frame.png",
		"/public/carousel/frame.png",
		"/public/carousel/frame.png",
		"/public/carousel/frame.png",
	];

	return (
		<section className="flex flex-col w-full gap-5 mb-10">
			{/* Search Bar */}
			<SearchBar />

			{/* Banner Carousel */}
			<BannerCarousel banners={banners} imageObject="cover" shadowAmount="lg" />

			{/* Timer-Based Ad */}
			<CountdownAd />

			{/* Categories Grid */}
			<Categories />

			{/* Horizontal Product Showcase */}
			<SpecialProducts />

			{/* Video/Watch Ad */}
			<WatchAd />
		</section>
	);
}
