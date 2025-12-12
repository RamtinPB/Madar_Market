"use client";
import { BannerCarousel } from "@/src/components/HomeScreen_comp/BannerCarousel";
import { SheetTitle } from "@/src/components/ui/sheet";

interface Props {
	title: string;
	image?: string;
}

export function ProductSheetHeader({ title, image }: Props) {
	return (
		<>
			<BannerCarousel
				banners={image ? [image] : []}
				imageObject="contain"
				shadowAmount="none"
			/>
			<SheetTitle className="text-[#6B6866]! pb-2">{title}</SheetTitle>
		</>
	);
}
