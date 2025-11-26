import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const SUBCATEGORIES = [
	{ name: "شیر" },
	{ name: "ماست" },
	{ name: "دوغ" },
	{ name: "پنیر" },
	{ name: "خامه" },
	{ name: "کره" },
	{ name: "کشک" },
	{ name: "بستنی" },
];

export default function SubCategories() {
	return (
		<section>
			<ScrollArea
				dir="rtl"
				className="w-full whitespace-nowrap pb-2 overflow-hidden"
			>
				<div className="flex gap-2.5">
					{SUBCATEGORIES.map((subcat) => (
						<Button
							key={subcat.name}
							className="rounded-2xl bg-[#F5F2EF] px-3 py-2 text-[16px] font-normal text-center text-[#787471]"
						>
							{subcat.name}
						</Button>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
