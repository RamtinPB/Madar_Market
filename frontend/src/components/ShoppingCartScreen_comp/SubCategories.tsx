import { useState } from "react";
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
	const [active, setActive] = useState<string | null>(null);

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
							onClick={() =>
								setActive(active === subcat.name ? null : subcat.name)
							}
							className={`rounded-2xl bg-[#F7F7F7] px-3 py-2 text-[16px] font-normal text-center text-[#787471] border border-transparent ${
								active === subcat.name && "text-[#FF6A29]  border-[#FF6A29]"
							}
`}
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
