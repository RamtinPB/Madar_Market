import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
	image: any;
	title: string;
	discount?: number;
	oldPrice?: string;
	newPrice: string;
}

export default function ProductCard({
	image,
	title,
	discount,
	oldPrice,
	newPrice,
}: ProductCardProps) {
	return (
		<div className="w-[156px] h-[299px] rounded-t-[12px] rounded-b-[20px] border flex flex-col shadow-sm text-wrap bg-white">
			{/* IMAGE */}
			<div className="relative w-[144px] h-[144px] m-2">
				<Image
					src={image}
					alt={title}
					fill
					className="object-cover rounded-lg"
				/>
			</div>

			{/* TITLE */}
			<span className="my-1 mx-2 text-[12px] font-medium text-[#4F4C4B] leading-18px">
				{title}
			</span>

			{/* DISCOUNT AREA */}
			{discount && oldPrice && (
				<div className="flex items-center justify-start mt-1 mx-2 gap-1.5">
					<div className="flex items-center justify-start text-[10px] line-through font-medium text-[#787471]">
						<span>{oldPrice}</span>
						<span>تومان</span>
					</div>
					<span className="text-[9px] font-normal text-white rounded-[20px] py-[2px] px-1 bg-[#C50F1F]">
						%{discount}
					</span>
				</div>
			)}

			{/* NEW PRICE */}
			<div className="flex items-center justify-start mt-1 mx-2 gap-1.5 text-[14px] font-bold text-[#BA400B] ">
				<span>{newPrice}</span>
				<span>تومان</span>
			</div>

			{/* BUTTON */}
			<Button className="w-full mt-auto p-2 h-[32px] bg-[#F5F2EF] rounded-[20px] text-[16px] font-medium text-[#787471]">
				افزودن به سبد
			</Button>
		</div>
	);
}
