import SearchBar from "../home_screen/SearchBar";
import { BannerCarousel } from "../home_screen/BannerCarousel";
import CountdownAd from "../home_screen/CountdownAd";
import Categories from "../home_screen/categories/Categories";
import SpecialProducts from "../home_screen/special_products/SpecialProducts";
import WatchAd from "../home_screen/WatchAd";

import banner1 from "@/public/assets/home_screen/carousel/frame.png";
import banner2 from "@/public/assets/home_screen/carousel/frame.png";
import banner3 from "@/public/assets/home_screen/carousel/frame.png";
import banner4 from "@/public/assets/home_screen/carousel/frame.png";

/* ------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------ */

export default function HomeScreen() {
	const banners = [banner1, banner2, banner3, banner4];

	return (
		<section className="flex flex-col w-full gap-5 mb-10">
			{/* Search Bar */}
			<SearchBar />

			{/* Banner Carousel */}
			<BannerCarousel height="147" banners={banners} imageObject="cover" />

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
