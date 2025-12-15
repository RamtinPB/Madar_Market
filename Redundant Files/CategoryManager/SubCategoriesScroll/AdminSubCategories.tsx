import { useEffect, useState } from "react";
import { Button } from "../../../ui/button";
import { ScrollArea, ScrollBar } from "../../../ui/scroll-area";
import { Card, CardContent } from "../../../ui/card";
import { Input } from "../../../ui/input";
import apiFetch from "@/src/lib/api/fetcher";
import PlusIcon from "@/public/assets/shopping_cart_screen/plus.svg";

interface SubCategoriesProps {
	categoryId: string | undefined;
	onSelectSubCategory?: (
		subCategory: {
			id: string;
			label: string;
		} | null
	) => void;
}

export default function SubCategories({
	categoryId,
	onSelectSubCategory,
}: SubCategoriesProps) {
	const [title, setTitle] = useState("");
	const [selected, setSelected] = useState<{ id: string; phase: 1 | 2 } | null>(
		null
	);
	const [subCats, setSubCats] = useState<{ id: string; label: string }[]>([]);

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

	const fetchSubCategories = () => {
		if (!categoryId) {
			setSubCats([]);
			return;
		}
		apiFetch(`${API_BASE}/categories/${categoryId}/get-all-subcategories`)
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data) && data.length > 0) {
					const mapped = data.map((c: any) => ({
						id: c.id,
						label: c.title,
					}));

					setSubCats(mapped);
				} else {
					setSubCats([]);
				}
			})

			.catch((e) => {
				console.warn("Failed to fetch categories from backend:", e);
			});
	};

	useEffect(() => {
		fetchSubCategories();
	}, [categoryId]);

	const handleCreate = async (categoryId: string) => {
		const formData = new FormData();
		formData.append("categoryId", `${categoryId}`);
		try {
			const response = await apiFetch(`${API_BASE}/subcategories/create`, {
				method: "POST",
				body: formData,
			});
			if (response.ok) {
				fetchSubCategories();
			} else {
				console.error("Failed to create sub category");
			}
		} catch (e) {
			console.error("Error creating sub category:", e);
		}
	};

	const handleEdit = async (categoryId: string, id: string, title: string) => {
		const formData = new FormData();
		formData.append("categoryId", `${categoryId}`);
		formData.append("title", `${title}`);
		try {
			const editResponse = await apiFetch(
				`${API_BASE}/subcategories/edit/${id}`,
				{
					method: "PUT",
					body: formData,
				}
			);
			if (!editResponse.ok) {
				console.error("Failed to edit sub category");
				return;
			}
			fetchSubCategories();
		} catch (e) {
			console.error("Error editing sub category:", e);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const response = await apiFetch(
				`${API_BASE}/subcategories/delete/${id}`,
				{
					method: "DELETE",
				}
			);
			if (response.ok) {
				fetchSubCategories();
			} else {
				console.error("Failed to delete sub category");
			}
		} catch (e) {
			console.error("Error deleting sub category:", e);
		}
	};

	const handleToggle = (subCat: { id: string; label: string }) => {
		if (!selected || selected.id !== subCat.id) {
			setSelected({ id: subCat.id, phase: 1 });
			setTitle(subCat.label);
			onSelectSubCategory?.(null);
		} else if (selected.phase === 1) {
			setSelected({ id: subCat.id, phase: 2 });
			onSelectSubCategory?.(subCat);
		} else {
			setSelected(null);
			onSelectSubCategory?.(null);
		}
	};

	return (
		<section>
			<ScrollArea
				dir="rtl"
				className="w-full whitespace-nowrap pb-2 overflow-hidden"
			>
				<div className="flex gap-2.5 py-2">
					{subCats.map((subcat) => (
						<Card
							key={subcat.id}
							className={`flex flex-col rounded-lg ${
								selected && selected.id === subcat.id && selected.phase === 1
									? "p-2"
									: "p-0 mt-2"
							} h-fit`}
						>
							<Button
								variant={"ghost"}
								onClick={() => handleToggle(subcat)}
								className={`rounded-lg shadow-sm bg-[#F7F7F7] text-[16px] font-normal text-center text-[#787471] 
							   ${
										selected && selected.id === subcat.id
											? selected.phase === 1
												? "border-2 border-cyan-500"
												: "border-2 border-[#FF6A29]"
											: " border-transparent"
									}
`}
							>
								{subcat.label}
							</Button>
							{selected &&
								selected.id === subcat.id &&
								selected.phase === 1 && (
									<>
										<Input
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											className="rounded-lg text-center text-[12px] p-0"
										/>
										<Button
											size="sm"
											variant="default"
											className=" rounded-lg"
											onClick={() =>
												handleEdit?.(categoryId!, subcat.id, title)
											}
										>
											ویرایش
										</Button>
										<Button
											size="sm"
											variant="destructive"
											className=" rounded-lg"
											onClick={() => handleDelete?.(subcat.id)}
										>
											حذف
										</Button>
									</>
								)}
						</Card>
					))}
					<Button
						onClick={() => handleCreate(categoryId!)}
						className={`rounded-lg shadow-sm bg-[#F7F7F7] mt-2 px-3 py-2 text-center `}
					>
						<PlusIcon className="w-fit! h-fit!" />
					</Button>
				</div>
				<ScrollBar orientation="horizontal" className="hidden" />
			</ScrollArea>
		</section>
	);
}
