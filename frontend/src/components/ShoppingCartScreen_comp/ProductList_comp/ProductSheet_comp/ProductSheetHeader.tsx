"use client";
import { BannerCarousel } from "@/src/components/HomeScreen_comp/BannerCarousel";
import { SheetTitle } from "@/src/components/ui/sheet";
import { StaticImageData } from "next/image";

interface Props {
	title: string;
	image?: StaticImageData;
}

export function ProductSheetHeader({ title, image }: Props) {
	return (
		<div className="flex flex-col gap-3">
			<BannerCarousel
				banners={image ? [image] : []}
				imageObject="contain"
				shadowAmount="none"
			/>
			<SheetTitle className="text-[#6B6866]!">{title}</SheetTitle>
		</div>
	);
}
