import apiFetch from "@/src/lib/api/fetcher";
import AdminCategoryItem from "./AdminCategoryItem";

interface AdminScrollCategoriesProps {
	onSelectCategory?: (category: {
		id: string;
		icon: string;
		label: string;
	}) => void;
}

/* ------------------------------------------------------------
 * CATEGORY ICON IMPORTS
 * ------------------------------------------------------------ */
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------
 * MAIN ADMIN SCROLL CATEGORIES COMPONENT
 * ------------------------------------------------------------ */

export default function Admin_ScrollCategories({
	onSelectCategory,
}: AdminScrollCategoriesProps) {
	const [selected, setSelected] = useState<{ id: string; phase: 1 | 2 } | null>(
		null
	);
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
				}
			})

			.catch((e) => {
				console.warn("Failed to fetch categories from backend:", e);
			});
	}, []);

	const handleToggle = (cat: { id: string; icon: string; label: string }) => {
		if (!selected || selected.id !== cat.id) {
			setSelected({ id: cat.id, phase: 1 });
		} else if (selected.phase === 1) {
			setSelected({ id: cat.id, phase: 2 });
			onSelectCategory?.(cat);
		} else {
			setSelected(null);
		}
	};

	return (
		<section>
			<ScrollArea
				dir="rtl"
				className="w-full whitespace-nowrap pb-2 overflow-hidden"
			>
				<div className="flex gap-4">
					{cats.map((cat) => (
						<AdminCategoryItem
							key={cat.id}
							icon={cat.icon}
							label={cat.label}
							phase={selected?.id === cat.id ? selected.phase : 0}
							onToggle={() => handleToggle(cat)}
						/>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
