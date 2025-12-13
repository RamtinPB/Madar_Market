"use client";

import apiFetch from "@/src/lib/api/fetcher";
import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------
 * MAIN CATEGORIES COMPONENT
 * ------------------------------------------------------------ */
export default function Categories() {
	const router = useRouter();
	const [cats, setCats] = useState<
		{ id: string; icon: string; label: string }[]
	>([]);

	useEffect(() => {
		// fetch categories from backend
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
					<CategoryItem
						key={cat.id}
						icon={cat.icon}
						label={cat.label}
						onclick={() => router.push(`/cart?categoryId=${cat.id}`)}
					/>
				))}
			</div>
		</div>
	);
}
