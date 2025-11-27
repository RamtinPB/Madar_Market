"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { StaticImageData } from "next/image";
import { BannerCarousel } from "@/components/home_screen/BannerCarousel";
import ProductSheetCard from "./ProductSheetCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// -------------------------------
// Props Types
// -------------------------------
interface Product {
	title: string;
	image?: StaticImageData;
	newPrice: string;
	oldPrice?: string;
	discount?: number;
	sponsorPrice?: string;
}

interface ProductSheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: Product | null;
}

const SheetData = [
	{ title: "نوع بسته بندی", data: "پلی اتیلن" },
	{ title: "مواد تشکیل دهنده", data: "شیر گاوی" },
	{ title: "نوع بسته بندی", data: "پلی اتیلن" },
	{ title: "مواد تشکیل دهنده", data: "شیر گاوی" },
];

// -------------------------------
// Product Sheet Component
// -------------------------------
export default function ProductSheet({
	open,
	onOpenChange,
	product,
}: ProductSheetProps) {
	if (!product) return null;
	const router = useRouter();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="flex flex-col justify-between px-4 py-6 h-11/12 pt-10 bg-[#FAFAFA]"
			>
				<div className=" flex flex-col gap-3">
					<BannerCarousel
						height="147"
						banners={product.image ? [product.image] : []}
						imageObject="contain"
						shadowAmount="none"
					/>
					<SheetTitle>{product.title}</SheetTitle>

					<div className="grid grid-cols-2 gap-3">
						{SheetData.map((item, i) => (
							<ProductSheetCard key={i} title={item.title} data={item.data} />
						))}
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<div
						className="flex justify-between rounded-md px-3 py-2"
						style={{
							border: "2px solid transparent",
							background:
								"linear-gradient(white, white) padding-box, linear-gradient(90deg, #D2DD25, #43B999, #02A9EC, #364FC0, #65029B) border-box",
						}}
					>
						<span className="text-[#65029B] text-[14px] font-bold">
							قیمت با حامی کارد
						</span>
						<div className=" flex items-center gap-1.5 text-[14px] font-bold text-[#0B8500]">
							<span className="">{product.sponsorPrice}</span>
							<span>تومان</span>
						</div>
					</div>
					<div className="flex flex-row justify-between ">
						<Button
							className={`
              rounded-md w-2/3 h-full text-white bg-[#FF6A29]
            `}
							onClick={() => router.push("/")}
						>
							افزودن به سبد خرید
						</Button>
						<div className="flex flex-col text-left gap-1 pl-1">
							<span className="text-[14px] text-[#787471]">قیمت کالا</span>
							<div className=" flex items-center gap-1.5 text-[16px] font-bold text-[#FF6A29]">
								<span className="">{product.oldPrice}</span>
								<span className="font-normal text-[10px]">تومان</span>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
