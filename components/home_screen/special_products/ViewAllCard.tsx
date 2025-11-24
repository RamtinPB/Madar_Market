import ArrowLeft from "@/public/assets/home_screen/special_products/arrow.png";
import Image from "next/image";

export default function ViewAllCard() {
	return (
		<button className="w-[156px] h-[299px] border rounded-xl flex flex-col items-center justify-center shadow-sm bg-white">
			<Image
				src={ArrowLeft}
				alt="مشاهده همه محصولات"
				className="w-[74px] h-[64px] text-[#C15323]"
			/>
		</button>
	);
}
