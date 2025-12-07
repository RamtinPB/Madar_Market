"use client";

import { useEffect, useState } from "react";

type Category = {
	id?: string;
	label: string;
	imageUrl: string;
	order?: number;
};

export default function CategoriesManager() {
	const [items, setItems] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [newLabel, setNewLabel] = useState("");
	const [newImageUrl, setNewImageUrl] = useState("");

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

	useEffect(() => {
		setLoading(true);
		fetch(`${API_BASE}/categories`)
			.then((r) => r.json())
			.then((data) => setItems(data))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	async function createCategory() {
		const payload = { label: newLabel, imageUrl: newImageUrl };
		const token = localStorage.getItem("token");
		const res = await fetch(`${API_BASE}/categories`, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		});
		const ret = await res.json();
		setItems((s) => [ret, ...s]);
		setNewLabel("");
		setNewImageUrl("");
	}

	async function remove(id?: string) {
		if (!id) return;
		const token = localStorage.getItem("token");
		await fetch(`${API_BASE}/categories/${id}`, {
			method: "DELETE",
			headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
		});
		setItems((s) => s.filter((c) => c.id !== id));
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<input
					value={newLabel}
					onChange={(e) => setNewLabel(e.target.value)}
					placeholder="برچسب"
					className="border p-2 rounded"
				/>
				<input
					value={newImageUrl}
					onChange={(e) => setNewImageUrl(e.target.value)}
					placeholder="آدرس تصویر (مثال: /static/categories/x.png)"
					className="border p-2 rounded flex-1"
				/>
				<button
					onClick={createCategory}
					className="bg-[#FF6A29] text-white p-2 rounded"
				>
					افزودن
				</button>
			</div>

			{loading && <div>Loading...</div>}

			<div className="grid grid-cols-3 gap-3">
				{items.map((c) => (
					<div
						key={c.label + c.imageUrl}
						className="border p-3 rounded flex items-center gap-3"
					>
						<img
							src={c.imageUrl}
							className="w-16 h-16 object-contain rounded"
						/>
						<div className="flex-1 text-right">
							<div className="font-bold">{c.label}</div>
							<div className="text-xs text-gray-500 wrap-break-word">
								{c.imageUrl}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<button
								className="text-sm text-red-600"
								onClick={() => remove((c as any).id)}
							>
								حذف
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
