import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import apiFetch from "@/src/lib/api/fetcher";

interface SubCategoriesProps {
	categoryId: string | undefined;
	onSelectSubCategory?: (subCategory: {
		id: string;
		icon: string;
		label: string;
	}) => void;
}

export default function SubCategories({
	categoryId,
	onSelectSubCategory,
}: SubCategoriesProps) {
	const [active, setActive] = useState<string | null>(null);
	const [subCats, setSubCats] = useState<
		{ id: string; icon: string; label: string }[]
	>([]);

	useEffect(() => {
		if (!categoryId) {
			setSubCats([]);
			return;
		}
		// fetch categories from backend
		const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
		apiFetch(`${API_BASE}/categories/${categoryId}/get-all-subcategories`)
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) {
					const mapped = data.map((c: any) => ({
						id: c.id,
						icon: `${API_BASE}${c.imagePath}`,
						label: c.title,
					}));

					setSubCats(mapped);
					setActive(mapped[0].label);
					onSelectSubCategory?.(mapped[0]);
				} else {
					setSubCats([]);
				}
			})

			.catch((e) => {
				console.warn("Failed to fetch categories from backend:", e);
			});
	}, [categoryId]);

	return (
		<section>
			<ScrollArea
				dir="rtl"
				className="w-full whitespace-nowrap pb-2 overflow-hidden"
			>
				<div className="flex gap-2.5">
					{subCats.map((subcat) => (
						<Button
							key={subcat.id}
							onClick={() => {
								const newActive = active === subcat.label ? null : subcat.label;
								setActive(newActive);
								if (newActive === null) {
									onSelectSubCategory?.(null as any); // optional — depends on your needs
								} else {
									onSelectSubCategory?.(subcat);
								}
							}}
							className={`rounded-2xl bg-[#F7F7F7] px-3 py-2 text-[16px] font-normal text-center text-[#787471] border border-transparent ${
								active === subcat.label && "text-[#FF6A29]  border-[#FF6A29]"
							}
`}
						>
							{subcat.label}
						</Button>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
