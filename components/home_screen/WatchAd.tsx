import Image from "next/image";

import WatchImage from "@/public/assets/home_screen/watch.png";

export default function WatchAd() {
	return (
		<div className="rounded-[12px] bg-gradient-to-r from-[#4AD3FF] to-[#D1F4FF] h-[69px] flex items-center px-3 justify-evenly">
			<span className=" text-[#01366A] font-bold leading-[20px] text-[12px]">
				ساعت مچی
				<br />
				دیـــجیتـــال
			</span>
			<Image src={WatchImage} alt="ساعت" className="" />
		</div>
	);
}
