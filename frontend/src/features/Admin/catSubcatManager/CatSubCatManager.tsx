"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Combobox } from "@/components/ui/combobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	File,
	Box,
	Edit,
	X,
	Image as ImageIcon,
	Search,
	Plus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import apiFetch from "@/lib/api/fetcher";

// Types
interface Category {
	id: string;
	title?: string;
	imageKey?: string | null;
	imageUrl?: string | null;
	order: number;
	subCategories: SubCategory[];
	_count: {
		subCategories: number;
	};
	createdAt: string;
	updatedAt: string;
}

interface SubCategory {
	id: string;
	title: string;
	order: number;
	categoryId: string;
	_count: {
		products: number;
	};
	createdAt: string;
	updatedAt: string;
}

interface Draft {
	id?: string;
	title: string;
	parentCategoryId: string | null; // null = category (top-level), string = subcategory
	imageFile?: File;
	shouldDeleteImage?: boolean;
}

// Helper Factory Functions
function createEmptyCategoryDraft(): Draft {
	return { title: "", parentCategoryId: null };
}

function createEmptySubCategoryDraft(parentCategoryId: string): Draft {
	return { title: "", parentCategoryId };
}

function createDraftFromCategory(category: Category): Draft {
	return {
		id: category.id,
		title: category.title || "",
		parentCategoryId: null,
		shouldDeleteImage: false,
	};
}

function createDraftFromSubCategory(sub: SubCategory): Draft {
	return {
		id: sub.id,
		title: sub.title,
		parentCategoryId: sub.categoryId,
	};
}

function filterCategories(
	categories: Category[],
	searchQuery: string,
): Category[] {
	if (!searchQuery) return categories;

	return categories
		.map((cat) => ({
			...cat,
			subCategories: cat.subCategories.filter((sub) =>
				sub.title.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		}))
		.filter(
			(cat) =>
				cat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				cat.subCategories.length > 0,
		);
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CatSubCatManager() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [draft, setDraft] = useState<Draft>(createEmptyCategoryDraft());
	const [loading, setLoading] = useState(true);

	// Derived state
	const filteredCategories = useMemo(
		() => filterCategories(categories, searchQuery),
		[categories, searchQuery],
	);

	// Computed helpers
	const isCreating = !draft.id;
	const isEditingCategory = draft.parentCategoryId === null;
	const isEditingSubCategory = draft.parentCategoryId !== null;

	// Fetch data
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const categoriesRes = await apiFetch(`${API_BASE}/categories`);
			const categoriesData: Category[] = await categoriesRes.json();

			setCategories(categoriesData);
		} catch (error) {
			console.error("Failed to fetch data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Handler Functions
	const handleCreateCategory = () => {
		setDraft(createEmptyCategoryDraft());
	};

	const handleCreateSubcategory = (parentId?: string) => {
		setDraft(createEmptySubCategoryDraft(parentId || ""));
	};

	const handleEdit = (item: Category | SubCategory) => {
		if ("subCategories" in item) {
			setDraft(createDraftFromCategory(item));
		} else {
			setDraft(createDraftFromSubCategory(item));
		}
	};

	const handleCancel = () => {
		setDraft(createEmptyCategoryDraft());
	};

	const handleDraftChange = (updates: Partial<Draft>) => {
		setDraft((prev) => ({ ...prev, ...updates }));
	};

	const handleRemoveImage = () => {
		handleDraftChange({
			imageFile: undefined,
			shouldDeleteImage: true,
		});
	};

	const handleSave = async () => {
		try {
			const token = localStorage.getItem("token");

			if (isEditingCategory) {
				if (draft.id) {
					// UPDATE existing category
					await apiFetch(`${API_BASE}/categories/${draft.id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						body: JSON.stringify({ title: draft.title }),
					});

					// Handle image changes
					if (draft.shouldDeleteImage) {
						await apiFetch(`${API_BASE}/categories/${draft.id}/image`, {
							method: "DELETE",
							headers: {
								...(token ? { Authorization: `Bearer ${token}` } : {}),
							},
						});
					}
					if (draft.imageFile) {
						const formData = new FormData();
						formData.append("image", draft.imageFile);
						await apiFetch(`${API_BASE}/categories/${draft.id}/image`, {
							method: "PUT",
							headers: {
								...(token ? { Authorization: `Bearer ${token}` } : {}),
							},
							body: formData,
						});
					}
				} else {
					// CREATE new category
					await apiFetch(`${API_BASE}/categories`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						body: JSON.stringify({ title: draft.title }),
					});
				}
			} else {
				// Subcategory logic (create or update)
				if (draft.id) {
					// UPDATE existing subcategory
					await apiFetch(`${API_BASE}/sub-categories/${draft.id}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						body: JSON.stringify({
							title: draft.title,
							categoryId: draft.parentCategoryId,
						}),
					});
				} else {
					// CREATE new subcategory
					await apiFetch(`${API_BASE}/sub-categories`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						body: JSON.stringify({
							title: draft.title,
							categoryId: draft.parentCategoryId,
						}),
					});
				}
			}

			await fetchData();
			handleCancel();
		} catch (error) {
			console.error("Failed to save:", error);
		}
	};

	// Combobox options
	const categoryOptions = useMemo(
		() => [
			{ value: "none", label: "دسته اصلی (جدید)" },
			...categories.map((cat) => ({
				value: cat.id,
				label: cat.title || "بدون عنوان",
			})),
		],
		[categories],
	);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">Loading...</div>
		);
	}

	return (
		<div dir="ltr" className="flex h-full gap-4 p-4">
			{/* Left Section - 2/3 */}
			<div className="w-2/3 space-y-4">
				{/* Action Buttons */}
				<div className="flex gap-2" dir="rtl">
					<Button
						variant="outline"
						size="sm"
						onClick={handleCreateCategory}
						className="flex items-center gap-1"
					>
						<Plus className="h-4 w-4" />
						دسته جدید
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleCreateSubcategory()}
						className="flex items-center gap-1"
					>
						<Plus className="h-4 w-4" />
						زیردسته جدید
					</Button>
				</div>

				{/* Search Bar */}
				<div className="relative" dir="rtl">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder="جستجو در دسته‌بندی‌ها و زیر دسته‌بندی‌ها..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10"
					/>
				</div>

				{/* Categories Accordion */}
				<ScrollArea className="h-[calc(100vh-200px)]">
					<Accordion type="multiple" className="grid grid-cols-2 gap-4">
						{filteredCategories.map((category) => (
							<AccordionItem
								key={category.id}
								value={category.id}
								className="h-fit border-0"
							>
								<AccordionTrigger className="flex flex-row items-center px-4 py-2 hover:no-underline">
									<Card
										className={`w-full p-4 flex flex-row-reverse items-center gap-4 ${draft.id === category.id ? "ring-2 ring-primary" : ""}`}
									>
										<div className="shrink">
											<img
												src={category.imageUrl ?? "/placeholder.png"}
												alt={category.title || "Category"}
												className="object-cover rounded"
											/>
										</div>
										<div className="flex-1 text-right h-fit">
											<h3 className="font-semibold">
												{category.title || "بدون عنوان"}
											</h3>
											<div className="flex gap-2 mt-2">
												<Badge
													variant="secondary"
													className="flex items-center gap-1"
												>
													محصول
													<span>
														{category.subCategories.reduce(
															(sum, sub) => sum + sub._count.products,
															0,
														)}
													</span>
													<Box className="h-3 w-3" />
												</Badge>
												<Badge
													variant="secondary"
													className="flex items-center gap-1"
												>
													زیردسته
													<span>{category.subCategories.length}</span>
													<File className="h-3 w-3" />
												</Badge>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												if (draft.id === category.id) {
													handleCancel();
												} else {
													handleEdit(category);
												}
											}}
										>
											{draft.id === category.id ? (
												<X className="h-4 w-4" />
											) : (
												<Edit className="h-4 w-4" />
											)}
										</Button>
									</Card>
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-4">
									<div className="grid grid-cols-2 gap-2">
										{category.subCategories.map((subCategory) => (
											<Card
												key={subCategory.id}
												className={`p-3 flex flex-row items-center justify-between min-h-[66px] ${draft.id === subCategory.id ? "ring-2 ring-primary" : ""}`}
											>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														if (draft.id === subCategory.id) {
															handleCancel();
														} else {
															handleEdit(subCategory);
														}
													}}
												>
													{draft.id === subCategory.id ? (
														<X className="h-4 w-4" />
													) : (
														<Edit className="h-4 w-4" />
													)}
												</Button>
												<span
													className="flex-1 w-full line-clamp-2 text-right truncate text-wrap mx-2"
													dir="rtl"
												>
													{subCategory.title}
												</span>
												<Box className="h-4 w-4 text-gray-500 shrink-0" />
											</Card>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</ScrollArea>
			</div>

			{/* Right Section - 1/3 Edit Panel (Always Visible) */}
			<div className="w-1/3 space-y-4" dir="rtl">
				<>
					<Input
						placeholder="نام دسته بندی"
						value={draft.title}
						onChange={(e) => handleDraftChange({ title: e.target.value })}
					/>

					<Combobox
						options={categoryOptions}
						value={
							draft.parentCategoryId === null ? "none" : draft.parentCategoryId
						}
						onValueChange={(value) =>
							handleDraftChange({
								parentCategoryId: value === "none" ? null : value,
							})
						}
						placeholder="گروه اصلی"
						searchPlaceholder="جستجو دسته‌بندی‌ها..."
						emptyMessage="دسته‌بندی یافت نشد"
					/>

					{isEditingCategory &&
						(() => {
							const currentCategory = categories.find(
								(cat) => cat.id === draft.id,
							);
							const hasExistingImage =
								currentCategory?.imageUrl && !draft.shouldDeleteImage;
							const imageSrc = draft.imageFile
								? URL.createObjectURL(draft.imageFile)
								: hasExistingImage
									? `${API_BASE}${currentCategory?.imageUrl}`
									: null;

							return (
								<div className=" space-y-4">
									{/* Image Preview */}
									<div className="size-[124px] ">
										{imageSrc ? (
											<div className="relative rounded-2xl">
												<Button
													variant="ghost"
													size="sm"
													className="absolute -top-1 -right-1 z-20 h-6 w-6 rounded-full p-0"
													onClick={handleRemoveImage}
												>
													<X className="h-3 w-3" />
												</Button>
												<img
													src={imageSrc}
													alt={draft.title || "Category"}
													className="object-cover rounded w-full h-full"
												/>
											</div>
										) : (
											<Skeleton className="relative w-full h-full rounded-2xl flex items-center justify-center">
												<ImageIcon className="h-12 w-12 text-gray-400" />
												<input
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															handleDraftChange({
																imageFile: file,
																shouldDeleteImage: false,
															});
														}
													}}
													className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
												/>
											</Skeleton>
										)}
									</div>

									{/* Info Text */}
									<div className="text-sm text-gray-600  space-y-1">
										<p>تصویر دسته بندی را بارگذاری کنید</p>
										<p>
											تصویر باید با پسوند jpeg , jpg , png , webp باشد . تصویر
											باید کمتر از 10 مگابایت باشد .
										</p>
									</div>
								</div>
							);
						})()}

					<Button onClick={handleSave} className="w-full">
						{isCreating ? "ایجاد" : "ویرایش"}
					</Button>
				</>
			</div>
		</div>
	);
}
