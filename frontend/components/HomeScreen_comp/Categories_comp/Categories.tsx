"use client";

import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------
 * MAIN CATEGORIES COMPONENT
 * ------------------------------------------------------------ */
export default function Categories() {
	const [cats, setCats] = useState<{ icon: string; label: string }[]>([]);

	useEffect(() => {
		// Try to fetch categories from backend, fall back to local static list
		const API_BASE =
			process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";
		fetch(`${API_BASE}/categories`)
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) {
					setCats(
						data.map((c: any) => ({
							icon: c.imageUrl, // string URL from backend
							label: c.label,
						}))
					);
				}
			})
			.catch((e) => {
				console.warn("Failed to fetch categories from backend:", e);
			});
	}, []);

	return (
		<div className="flex flex-col gap-5">
			{/* HEADER */}
			<div className="flex items-center justify-between">
				<h1 className="text-base font-bold text-[#BA400B]">دسته بندی ها</h1>
				<span className="text-base font-medium text-[#C15323]">
					انتخاب سریع محصولات
				</span>
			</div>

			{/* GRID */}
			<div className="mt-1 grid grid-cols-4 gap-4">
				{cats.map((cat) => (
					<CategoryItem key={cat.label} icon={cat.icon} label={cat.label} />
				))}
			</div>
		</div>
	);
}
