import SearchBar from "../Home/SearchBar";
import { BannerCarousel } from "../Home/BannerCarousel";
import CountdownAd from "../Home/CountdownAd";
import Categories from "../Home/Categories/Categories";
import SpecialProducts from "../Home/SpecialProducts/SpecialProducts";
import WatchAd from "../Home/WatchAd";

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
