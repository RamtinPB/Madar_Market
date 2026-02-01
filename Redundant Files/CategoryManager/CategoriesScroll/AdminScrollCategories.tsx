"use client";

import apiFetch from "@/lib/api/fetcher";
import AdminCategoryItem from "./AdminCategoryItem";

interface AdminScrollCategoriesProps {
	onSelectCategory?: (
		category: {
			id: string;
			icon: string;
			label: string;
		} | null,
	) => void;
}

import { ScrollArea, ScrollBar } from "../../../ui/scroll-area";
import { useEffect, useState } from "react";
import PlusIcon from "@/public/assets/shopping_cart_screen/plus.svg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------
 * MAIN ADMIN SCROLL CATEGORIES COMPONENT
 * ------------------------------------------------------------ */

export default function AdminScrollCategories({
	onSelectCategory,
}: AdminScrollCategoriesProps) {
	const [selected, setSelected] = useState<{ id: string; phase: 1 | 2 } | null>(
		null,
	);
	const [cats, setCats] = useState<
		{ id: string; icon: string; label: string }[]
	>([]);

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

	const fetchCategories = () => {
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
				} else {
					setCats([]);
				}
			})
			.catch((e) => {
				console.warn("Failed to fetch categories from backend:", e);
			});
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleCreate = async () => {
		const formData = new FormData();
		formData.append("title", "دسته بندی جدید");
		try {
			const response = await apiFetch(`${API_BASE}/categories/create`, {
				method: "POST",
				body: formData,
			});
			if (response.ok) {
				fetchCategories();
			} else {
				console.error("Failed to create category");
			}
		} catch (e) {
			console.error("Error creating category:", e);
		}
	};

	const handleEdit = async (
		id: string,
		title: string,
		imageFile: File | null,
	) => {
		try {
			const editResponse = await apiFetch(`${API_BASE}/categories/edit/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title }),
			});
			if (!editResponse.ok) {
				console.error("Failed to edit category");
				return;
			}
			if (imageFile) {
				const imageFormData = new FormData();
				imageFormData.append("image", imageFile);
				const imageResponse = await apiFetch(
					`${API_BASE}/categories/edit-image/${id}/image`,
					{
						method: "PUT",
						body: imageFormData,
					},
				);
				if (!imageResponse.ok) {
					console.error("Failed to upload image");
				}
			}
			fetchCategories();
		} catch (e) {
			console.error("Error editing category:", e);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const response = await apiFetch(`${API_BASE}/categories/delete/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				fetchCategories();
			} else {
				console.error("Failed to delete category");
			}
		} catch (e) {
			console.error("Error deleting category:", e);
		}
	};

	const handleToggle = (cat: { id: string; icon: string; label: string }) => {
		if (!selected || selected.id !== cat.id) {
			setSelected({ id: cat.id, phase: 1 });
			onSelectCategory?.(null);
		} else if (selected.phase === 1) {
			setSelected({ id: cat.id, phase: 2 });
			onSelectCategory?.(cat);
		} else {
			setSelected(null);
			onSelectCategory?.(null);
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
							id={cat.id}
							icon={cat.icon}
							label={cat.label}
							phase={selected?.id === cat.id ? selected.phase : 0}
							onToggle={() => handleToggle(cat)}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>
					))}

					<Card className=" flex flex-col items-center p-4 min-w-50 h-fit">
						<CardContent className="flex flex-col h-[76px]! aspect-square p-0">
							<Button
								variant={"secondary"}
								className="w-full! h-full!"
								onClick={handleCreate}
							>
								<PlusIcon className="w-fit! h-fit!" />
							</Button>
						</CardContent>
						<span className="mt-1 text-[12px] text-center text-[#333]">
							اضافه کردن دسته بندی
						</span>
					</Card>
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
