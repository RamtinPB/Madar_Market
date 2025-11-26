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

import banner1 from "@/public/assets/home_screen/carousel/frame.png";
import banner2 from "@/public/assets/home_screen/carousel/frame.png";
import banner3 from "@/public/assets/home_screen/carousel/frame.png";
import banner4 from "@/public/assets/home_screen/carousel/frame.png";

export function BannerCarousel() {
	const banners = [banner1, banner2, banner3, banner4];

	const [currentIndex, setCurrentIndex] = useState(0);

	return (
		<div className="relative w-full h-[147px] ">
			{/* CAROUSEL */}
			<Carousel
				className="w-full h-[147px] border-2 border-white shadow-lg rounded-xl overflow-hidden"
				opts={{
					loop: true,
					startIndex: 0,
				}}
				setApi={(api) => {
					if (!api) return;

					const updateIndex = () => {
						const idx = api.selectedScrollSnap();
						setCurrentIndex(idx);
					};

					// Initial update AFTER embla is fully ready
					api.on("init", updateIndex);

					// Recalculate on change
					api.on("select", updateIndex);
				}}
			>
				<CarouselContent>
					{banners.map((banner, index) => (
						<CarouselItem key={index} className="relative h-[147px] w-full">
							<div className="relative w-full h-full rounded-xl ">
								<Image src={banner} alt={`banner-${index}`} fill priority />
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious className="hidden" />
				<CarouselNext className="hidden" />
			</Carousel>

			{/* PAGINATION DOTS */}
			<div
				dir="ltr"
				className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 z-20"
			>
				{banners.map((_, index) => (
					<div
						key={index}
						className={
							index === currentIndex
								? "w-4 h-1.5 bg-linear-to-b from-[#FFFFFF] to-[#D79BC8] rounded-full transition-all"
								: "w-1.5 h-1.5 bg-[#FFFFFF] opacity-20 rounded-full transition-all"
						}
					/>
				))}
			</div>
		</div>
	);
}
