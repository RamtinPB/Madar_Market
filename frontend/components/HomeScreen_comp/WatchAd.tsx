import Image from "next/image";
import WatchImage from "@/public/assets/home_screen/watch.png";

export default function WatchAd() {
	return (
		<div className="flex items-center justify-evenly h-[69px] rounded-[12px] bg-linear-to-r from-[#4AD3FF] to-[#D1F4FF] pe-10">
			{/* Text Section */}
			<div className="text-[#01366A] font-bold leading-5  text-[12px] text-center">
				ساعت مچی
				<br />
				دیـــجیتـــال
			</div>

			{/* Image Section */}
			<Image src={WatchImage} width={32} height={59} alt="ساعت دیجیتال" />
		</div>
	);
}
