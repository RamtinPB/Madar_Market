import apiFetch from "@/src/lib/api/fetcher";
import CategoryItem from "../HomeScreen_comp/Categories_comp/CategoryItem";

interface ScrollCategoriesProps {
	onSelectCategory?: (category: {
		id: string;
		icon: string;
		label: string;
	}) => void;
	initialSelectedId?: string | null;
}

/* ------------------------------------------------------------
 * CATEGORY ICON IMPORTS
 * ------------------------------------------------------------ */
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------
 * MAIN CATEGORIES COMPONENT
 * ------------------------------------------------------------ */

export default function ScrollCategories({
	onSelectCategory,
	initialSelectedId,
}: ScrollCategoriesProps) {
	const [active, setActive] = useState<string | null>(null);
	const [cats, setCats] = useState<
		{ id: string; icon: string; label: string }[]
	>([]);

	useEffect(() => {
		const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
		apiFetch(`${API_BASE}/categories/get-all`)
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) {
					const mapped = data.map((c: any) => ({
						id: c.id,
						icon: `${API_BASE}${c.imagePath}`,
						label: c.title,
					}));

					setCats(mapped);

					// set initial category
					if (initialSelectedId) {
						const selectedCat = mapped.find((c) => c.id === initialSelectedId);
						if (selectedCat) {
							setActive(selectedCat.label);
							onSelectCategory?.(selectedCat);
						} else {
							// fallback to first
							setActive(mapped[0].label);
							onSelectCategory?.(mapped[0]);
						}
					} else {
						// default to first
						setActive(mapped[0].label);
						onSelectCategory?.(mapped[0]);
					}
				}
			})

			.catch((e) => {
				console.warn("Failed to fetch categories from backend:", e);
			});
	}, []);

	return (
		<section>
			<ScrollArea
				dir="rtl"
				className="w-full whitespace-nowrap pb-2 overflow-hidden"
			>
				<div className="flex gap-4">
					{cats.map((cat) => (
						<CategoryItem
							key={cat.id}
							icon={cat.icon}
							label={cat.label}
							active={active === cat.label}
							onclick={() => {
								const newActive = active === cat.label ? null : cat.label;
								setActive(newActive);

								if (newActive === null) {
									onSelectCategory?.(null as any); // optional — depends on your needs
								} else {
									onSelectCategory?.(cat);
								}
							}}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
