"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";

import banner1 from "@/public/assets/home_screen/special_products/Cart.png";
import banner2 from "@/public/assets/home_screen/special_products/machhiato.png";
import banner3 from "@/public/assets/home_screen/special_products/olive_oil.png";
import banner4 from "@/public/assets/home_screen/special_products/qh.png";

export function BannerCarousel() {
	const banners = [banner1, banner2, banner3, banner4];

	const [currentIndex, setCurrentIndex] = useState(0);

	return (
		<div className="relative w-full h-[147px]">
			{/* CAROUSEL */}
			<Carousel
				className="w-full h-[147px] border-2 border-white shadow-lg rounded-xl overflow-hidden"
				opts={{
					align: "center",
					loop: true,
					startIndex: banners.length - 1,
				}}
				setApi={(api) => {
					if (!api) return;

					const updateIndex = () => {
						const idx = api.selectedScrollSnap();
						setCurrentIndex(banners.length - 1 - idx);
					};

					// Initial update AFTER embla is fully ready
					api.on("init", updateIndex);

					// Recalculate on change
					api.on("select", updateIndex);
				}}
			>
				<CarouselContent>
					{banners.map((banner, index) => (
						<CarouselItem key={index} className="w-full h-[147px]">
							<div className="relative w-full h-full">
								<Image
									src={banner}
									alt={`banner-${index}`}
									fill
									className="rounded-xl object-scale-down"
									priority
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* PAGINATION DOTS */}
			<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 z-20">
				{banners.map((_, index) => (
					<div
						key={index}
						className={
							index === currentIndex
								? "w-[16px] h-[6px] bg-gray-600 rounded-full transition-all"
								: "w-[6px] h-[6px] bg-gray-500 rounded-full transition-all"
						}
					/>
				))}
			</div>
		</div>
	);
}
