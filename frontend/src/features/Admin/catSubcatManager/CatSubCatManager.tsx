"use client";

import React, { useState, useEffect } from "react";
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
import { File, Box, Edit, X, Image as ImageIcon, Search } from "lucide-react";
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

interface EditData {
	type: "category" | "subcategory";
	id: string;
	title: string;
	categoryId?: string; // for subcategory
	imageFile?: File; // for category
	shouldDeleteImage?: boolean; // flag to track if image should be deleted
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CatSubCatManager() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [editData, setEditData] = useState<EditData | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(true);

	// Fetch data
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const categoriesRes = await apiFetch(`${API_BASE}/categories`);
			const categoriesData: Category[] = await categoriesRes.json();

			setCategories(categoriesData);
			setFilteredCategories(categoriesData);
		} catch (error) {
			console.error("Failed to fetch data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Search functionality
	useEffect(() => {
		if (!searchQuery) {
			setFilteredCategories(categories);
			return;
		}

		const filtered = categories
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

		setFilteredCategories(filtered);
	}, [searchQuery, categories]);

	const handleEdit = (
		type: "category" | "subcategory",
		item: Category | SubCategory,
	) => {
		setEditData({
			type,
			id: item.id,
			title: item.title || "",
			categoryId:
				type === "subcategory" ? (item as SubCategory).categoryId : undefined,
		});
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setEditData(null);
		setIsEditing(false);
	};

	const handleRemoveImage = () => {
		if (!editData) return;

		const currentCategory = categories.find((cat) => cat.id === editData.id);
		const hasExistingImage = currentCategory?.imageUrl;

		setEditData({
			...editData,
			imageFile: undefined,
			shouldDeleteImage: hasExistingImage ? true : false,
		});
	};

	const handleSaveEdit = async () => {
		if (!editData) return;

		try {
			const token = localStorage.getItem("token");

			if (editData.type === "category") {
				// Update category title
				await apiFetch(`${API_BASE}/categories/${editData.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({
						title: editData.title,
					}),
				});

				// Delete image if requested
				if (editData.shouldDeleteImage) {
					await apiFetch(`${API_BASE}/categories/${editData.id}/image`, {
						method: "DELETE",
						headers: {
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
					});
				}

				// Upload image if selected
				if (editData.imageFile) {
					const formData = new FormData();
					formData.append("image", editData.imageFile);

					await apiFetch(`${API_BASE}/categories/${editData.id}/image`, {
						method: "PUT",
						headers: {
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						body: formData,
					});
				}
			} else {
				// Update subcategory
				await apiFetch(`${API_BASE}/sub-categories/${editData.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({
						title: editData.title,
						id: editData.categoryId,
					}),
				});
			}

			await fetchData(); // Refresh data
			handleCancelEdit();
		} catch (error) {
			console.error("Failed to save:", error);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">Loading...</div>
		);
	}

	return (
		<div dir="ltr" className="flex h-full gap-4 p-4">
			{/* Left Section - 2/3 */}
			<div className="w-2/3 space-y-4">
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
								className="h-fit border-0 "
							>
								<AccordionTrigger className="flex flex-row items-center px-4 py-2 hover:no-underline">
									<Card className="w-full p-4 flex flex-row-reverse items-center gap-4">
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
												if (isEditing && editData?.id === category.id) {
													handleCancelEdit();
												} else {
													handleEdit("category", category);
												}
											}}
										>
											{isEditing && editData?.id === category.id ? (
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
												className="p-3 flex flex-row items-center justify-between min-h-[66px]"
											>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														if (isEditing && editData?.id === subCategory.id) {
															handleCancelEdit();
														} else {
															handleEdit("subcategory", subCategory);
														}
													}}
												>
													{isEditing && editData?.id === subCategory.id ? (
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

			{/* Right Section - 1/3 Edit Panel */}
			<div className="w-1/3 space-y-4" dir="rtl">
				{editData ? (
					<>
						<Input
							placeholder="نام دسته بندی"
							value={editData.title}
							onChange={(e) =>
								setEditData({ ...editData, title: e.target.value })
							}
						/>

						{editData.type === "subcategory" && (
							<Combobox
								options={categories.map((cat) => ({
									value: cat.id,
									label: cat.title || "بدون عنوان",
								}))}
								value={editData.categoryId}
								onValueChange={(value) =>
									setEditData({ ...editData, categoryId: value })
								}
								placeholder="گروه اصلی"
								searchPlaceholder="جستجو دسته‌بندی‌ها..."
								emptyMessage="دسته‌بندی یافت نشد"
							/>
						)}

						{editData.type === "category" &&
							(() => {
								const currentCategory = categories.find(
									(cat) => cat.id === editData.id,
								);
								const hasExistingImage =
									currentCategory?.imageUrl && !editData.shouldDeleteImage;
								const imageSrc = editData.imageFile
									? URL.createObjectURL(editData.imageFile)
									: hasExistingImage
										? `${API_BASE}${currentCategory.imageUrl}`
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
														alt={editData.title || "Category"}
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
																setEditData({
																	...editData,
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

						<Button onClick={handleSaveEdit} className="w-full">
							ویرایش
						</Button>
					</>
				) : (
					<div className="text-center text-gray-500 mt-8">
						آیتمی برای ویرایش انتخاب نشده
					</div>
				)}
			</div>
		</div>
	);
}
