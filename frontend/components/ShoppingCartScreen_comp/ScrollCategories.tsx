import CategoryItem from "../HomeScreen_comp/Categories_comp/CategoryItem";

/* ------------------------------------------------------------
 * CATEGORY ICON IMPORTS
 * ------------------------------------------------------------ */
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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useState } from "react";

/* ------------------------------------------------------------
 * CATEGORY LIST (DATA MODEL)
 * Ideally moved to a constants file if reused elsewhere.
 * ------------------------------------------------------------ */
const CATEGORIES = [
	{ icon: Accecories, label: "لوازم‌جانبی" },
	{ icon: Disposable, label: "یکبار مصرف" },
	{ icon: Health, label: "سلامت" },
	{ icon: WritingSupplies, label: "لوازم تحریر" },
	{ icon: Additives, label: "افزودنی ها" },
	{ icon: DriedFruitsNSweets, label: "خشکبار، شیرینی" },
	{ icon: Canned, label: "کنسروی و آماده" },
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

/* ------------------------------------------------------------
 * MAIN CATEGORIES COMPONENT
 * ------------------------------------------------------------ */

export default function ScrollCategories() {
	const [active, setActive] = useState<string | null>(null);

	return (
		<section>
			<ScrollArea
				dir="rtl"
				className="w-full whitespace-nowrap pb-2 overflow-hidden"
			>
				<div className="flex gap-4">
					{CATEGORIES.map((cat) => (
						<CategoryItem
							key={cat.label}
							icon={cat.icon}
							label={cat.label}
							active={active === cat.label}
							onclick={() => setActive(active === cat.label ? null : cat.label)}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
