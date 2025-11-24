import Image from "next/image";

import Accecories from "@/public/assets/home_screen/categories/Accessories.png";
import Additives from "@/public/assets/home_screen/categories/Additives.png";
import BackedGoods from "@/public/assets/home_screen/categories/BackedGoods.png";
import Breakfast from "@/public/assets/home_screen/categories/Breakfast.png";
import Canned from "@/public/assets/home_screen/categories/Canned.png";
import Cosmetics from "@/public/assets/home_screen/categories/Cosmetics.png";
import Dairy from "@/public/assets/home_screen/categories/Dairy.png";
import Disposable from "@/public/assets/home_screen/categories/Disposable.png";
import DriedFruitsNSweets from "@/public/assets/home_screen/categories/Dried fruits, sweets.png";
import Drinks from "@/public/assets/home_screen/categories/Drinks.png";
import EssentialGroceries from "@/public/assets/home_screen/categories/Essential Groseries.png";
import FruitsNVegetables from "@/public/assets/home_screen/categories/Fruits and Vegetables.png";
import Health from "@/public/assets/home_screen/categories/Health.png";
import HomeNHygiene from "@/public/assets/home_screen/categories/home and hygiene.png";
import MotherNChild from "@/public/assets/home_screen/categories/Mother and child.png";
import Pickled from "@/public/assets/home_screen/categories/Pickled.png";
import Protein from "@/public/assets/home_screen/categories/Protein.png";
import Refrigerated from "@/public/assets/home_screen/categories/Refrigerated.png";
import Snacks from "@/public/assets/home_screen/categories/Snacks.png";
import WritingSupplies from "@/public/assets/home_screen/categories/Writing supplies.png";

const categories = [
	{ icon: Accecories, label: "لوازم‌جانبی" },
	{ icon: Disposable, label: "یکبار مصرف" },
	{ icon: Health, label: "سلامت" },
	{ icon: WritingSupplies, label: "لوازم تحریر" },
	{ icon: Additives, label: "افزودنی ها" },
	{ icon: DriedFruitsNSweets, label: "خشکبار، شیرینی" },
	{ icon: Canned, label: "کنسروی و  آماده" },
	{ icon: Snacks, label: "تنقلات" },
	{ icon: Refrigerated, label: "منجمد، یخچالی" },
	{ icon: Cosmetics, label: "آرایشی بهداشتی" },
	{ icon: MotherNChild, label: "مادر و کودک" },
	{ icon: HomeNHygiene, label: "بهداشت خانگی" },
	{ icon: Pickled, label: "شور و ترشیجات" },
	{ icon: Drinks, label: "نوشیدنی" },
	{ icon: Dairy, label: "لبنیات" },
	{ icon: Protein, label: "پروتئینی" },
	{ icon: EssentialGroceries, label: "اساسی و خواربار" },
	{ icon: Breakfast, label: "صبحانه" },
	{ icon: BackedGoods, label: "نان و شیرینی" },
	{ icon: FruitsNVegetables, label: "میوه، سبزیجات" },
];

interface CategoryItemProps {
	icon: any;
	label: string;
}

function CategoryItem({ icon, label }: CategoryItemProps) {
	return (
		<div className="flex flex-col items-center">
			<div className="w-[73px] h-[76px] bg-gradient-to-b from-[#FFF7F5] to-[#FFEBE5] rounded-xl flex items-center justify-center shadow-xs">
				{/* FIXED SIZE CONTAINER */}
				<div className="relative w-[53px] h-[53px] overflow-hidden rounded-lg">
					<Image src={icon} alt={label} fill className="object-contain" />
				</div>
			</div>

			<span className="text-[12px] text-center mt-1 text-[#333]">{label}</span>
		</div>
	);
}

export default function Categories() {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-[#BA400B] font-bold text-base">دسته بندی ها</h1>
				<span className="text-[#C15323] font-medium text-base">
					انتخاب سریع محصولات
				</span>
			</div>
			<div className="grid grid-cols-4 gap-4 mt-1">
				{categories.map((cat, index) => (
					<CategoryItem key={index} icon={cat.icon} label={cat.label} />
				))}
			</div>
		</div>
	);
}
