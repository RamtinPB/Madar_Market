"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BannerCarouselProps {
	banners: StaticImageData[];
	imageObject: string;
	shadowAmount: string;
}

export function BannerCarousel({
	banners,
	imageObject,
	shadowAmount,
}: BannerCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(4);

	return (
		<div className="relative w-full aspect-video" dir="rtl">
			{/* SWIPER */}
			<Swiper
				dir="rtl"
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={0}
				slidesPerView={1}
				loop={true}
				onSlideChange={(swiper: SwiperType) => {
					const reversedIndex = swiper.realIndex;
					const originalIndex = banners.length - 1 - reversedIndex;
					setCurrentIndex(originalIndex);
				}}
				className={`w-full h-full border-2 border-white bg-white shadow-${shadowAmount} rounded-xl`}
			>
				{[...banners].reverse().map((banner, reverseIndex) => {
					const originalIndex = banners.length - 1 - reverseIndex;
					return (
						<SwiperSlide key={originalIndex}>
							<div className={`relative w-full h-full rounded-xl`}>
								<Image
									src={banner}
									alt={`banner-${originalIndex}`}
									fill
									priority={originalIndex === 0}
									className={`object-${imageObject}`}
								/>
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>

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
