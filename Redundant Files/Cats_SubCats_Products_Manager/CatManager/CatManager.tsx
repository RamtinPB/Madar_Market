"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CategoriesAPI, Category } from "@/lib/api/categories";
import { SubCategory } from "@/lib/api/subcategories";
import { Edit3, Trash2, Plus, Eye } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SubCatManager from "./SubCatManager/SubCatManager";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function CatManager() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedImage, setEditedImage] = useState<File | null>(null);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newImage, setNewImage] = useState<File | null>(null);
	const [currentView, setCurrentView] = useState<
		"categories" | "subcategories"
	>("categories");
	const [selectedCategoryForSubcats, setSelectedCategoryForSubcats] =
		useState<Category | null>(null);
	const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
	const [subcategoryCounts, setSubcategoryCounts] = useState<
		Record<string, number>
	>({});

	const itemsPerPage = 10;

	useEffect(() => {
		loadCategories();
	}, []);

	useEffect(() => {
		const filtered = categories.filter(
			(category) =>
				category.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				category.title.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredCategories(filtered);
		setCurrentPage(1);
	}, [categories, searchTerm]);

	const loadCategories = async () => {
		try {
			setLoading(true);
			const data = await CategoriesAPI.getAll();
			setCategories(data);
			loadSubcategoryCounts(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load categories",
			);
		} finally {
			setLoading(false);
		}
	};

	const loadSubcategoryCounts = async (cats: Category[]) => {
		const promises = cats.map(async (category) => {
			try {
				const subs = await CategoriesAPI.getSubcategoriesByCategory(
					category.id,
				);
				return { id: category.id, count: subs.length };
			} catch {
				return { id: category.id, count: 0 };
			}
		});
		const results = await Promise.all(promises);
		const counts: Record<string, number> = {};
		results.forEach(({ id, count }) => {
			counts[id] = count;
		});
		setSubcategoryCounts(counts);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this category?")) return;

		try {
			await CategoriesAPI.delete(id);
			await loadCategories();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete category",
			);
		}
	};

	const handleEdit = async (category: Category) => {
		setSelectedCategory(category);
		// Call /categories/get/{id} to get full data
		try {
			const fullCategory = await CategoriesAPI.getById(category.id);
			setSelectedCategory(fullCategory);
			setEditedTitle(fullCategory.title);
			setEditedImage(null);
			setEditDialogOpen(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load category");
		}
	};

	const handleAdd = () => {
		setNewTitle("");
		setNewImage(null);
		setAddDialogOpen(true);
	};

	const handleCreate = async () => {
		try {
			await CategoriesAPI.create({
				title: newTitle,
				image: newImage || undefined,
			});
			await loadCategories();
			setAddDialogOpen(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create category",
			);
		}
	};

	const handleApply = async () => {
		if (!selectedCategory) return;

		try {
			let updatedCategory = selectedCategory;

			// Upload image if provided
			if (editedImage) {
				updatedCategory = await CategoriesAPI.uploadImage(
					selectedCategory.id,
					editedImage,
				);
			}

			// Update title if changed
			if (editedTitle !== selectedCategory.title) {
				updatedCategory = await CategoriesAPI.update(selectedCategory.id, {
					title: editedTitle,
				});
			}

			await loadCategories();
			setEditDialogOpen(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to update category",
			);
		}
	};

	const handleViewSubcategories = async (category: Category) => {
		setSelectedCategoryForSubcats(category);
		setCurrentView("subcategories");
		try {
			const subs = await CategoriesAPI.getSubcategoriesByCategory(category.id);
			setSubcategories(subs);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load subcategories",
			);
		}
	};

	const handleSubcategoryDataChange = async () => {
		// Reload categories and subcategory counts
		await loadCategories();
		// Reload subcategories for current category if in subcategories view
		if (selectedCategoryForSubcats) {
			try {
				const subs = await CategoriesAPI.getSubcategoriesByCategory(
					selectedCategoryForSubcats.id,
				);
				setSubcategories(subs);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to reload subcategories",
				);
			}
		}
	};

	const paginatedCategories = filteredCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="flex flex-col gap-4 p-4" dir="rtl">
			<Breadcrumb className="font-extrabold pb-2 cursor-pointer">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink onClick={() => setCurrentView("categories")}>
							دسته‌بندی‌ها
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="[&>svg]:scale-x-[-1]" />
					<BreadcrumbItem>
						{currentView !== "categories" && (
							<BreadcrumbPage>
								{`زیردسته - ${selectedCategoryForSubcats?.title}`}
							</BreadcrumbPage>
						)}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			{currentView === "categories" ? (
				<>
					<div className="flex justify-between items-center">
						<Input
							placeholder="جستوجو..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm"
						/>
						<Button onClick={handleAdd} className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							اضافه کردن دسته بندی
						</Button>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-right">تصویر</TableHead>
								{/* <TableHead className="text-right">شناسه</TableHead> */}
								<TableHead className="text-right">عنوان</TableHead>
								<TableHead className="text-right">تاریخ ساخت</TableHead>
								<TableHead className="text-right">تاریخ آخرین ویرایش</TableHead>
								<TableHead className="text-right">عملیات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedCategories.map((category) => (
								<TableRow key={category.id}>
									<TableCell>
										<Avatar>
											<AvatarImage
												src={category.imagePath || undefined}
												alt={category.title}
											/>
											<AvatarFallback>
												{category.title.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</TableCell>
									{/* <TableCell>{category.id}</TableCell> */}
									<TableCell>{category.title}</TableCell>
									<TableCell>
										{new Date(category.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{new Date(category.updatedAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<div className="flex gap-5">
											<Tooltip>
												<TooltipTrigger>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleViewSubcategories(category)}
													>
														<Eye className="h-4 w-4" />
														{`${subcategoryCounts[category.id] || 0}`}
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>مشاهده زیردسته ها</p>
												</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger>
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEdit(category)}
													>
														<Edit3 className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>ویرایش دسته بندی</p>
												</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger>
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(category.id)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>حذف دسته بندی</p>
												</TooltipContent>
											</Tooltip>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{/* Pagination */}
					{totalPages > 1 && (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											currentPage > 1 && setCurrentPage(currentPage - 1)
										}
										className={
											currentPage === 1
												? "pointer-events-none opacity-50 [&>svg]:scale-x-[-1]"
												: "cursor-pointer [&>svg]:scale-x-[-1]"
										}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(
									(page) => (
										<PaginationItem key={page}>
											<PaginationLink
												onClick={() => setCurrentPage(page)}
												isActive={currentPage === page}
												className="cursor-pointer"
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									),
								)}
								<PaginationItem>
									<PaginationNext
										onClick={() =>
											currentPage < totalPages &&
											setCurrentPage(currentPage + 1)
										}
										className={
											currentPage === totalPages
												? "pointer-events-none opacity-50 [&>svg]:scale-x-[-1]"
												: "cursor-pointer [&>svg]:scale-x-[-1]"
										}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					)}

					{/* Edit Dialog */}
					<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
						<DialogContent className="max-w-md">
							<div className="space-y-6">
								{/* Preview Section */}
								<div className="flex flex-col items-center space-y-4">
									<Avatar className="w-24 h-24 rounded-xl">
										<AvatarImage
											src={
												editedImage
													? URL.createObjectURL(editedImage)
													: selectedCategory?.imagePath || undefined
											}
											alt={editedTitle}
										/>
										<AvatarFallback>{editedTitle.charAt(0)}</AvatarFallback>
									</Avatar>
									<p className="text-lg font-medium">{editedTitle || "جدید"}</p>
								</div>

								<Separator />

								{/* Edit Section */}
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											آپلود عکس
										</label>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) setEditedImage(file);
											}}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											عنوان
										</label>
										<Input
											value={editedTitle}
											onChange={(e) => setEditedTitle(e.target.value)}
											placeholder="عنوان دسته بندی را وارد کنید"
										/>
									</div>
								</div>

								{/* Footer */}
								<div className="flex justify-center">
									<Button onClick={handleApply}>اعمال تغییرات</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>

					{/* Add Dialog */}
					<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
						<DialogContent className="max-w-md">
							<div className="space-y-6">
								{/* Preview Section */}
								<div className="flex flex-col items-center space-y-4">
									<Avatar className="w-24 h-24">
										<AvatarImage
											src={newImage ? URL.createObjectURL(newImage) : undefined}
											alt={newTitle}
										/>
										<AvatarFallback>{newTitle.charAt(0) || "?"}</AvatarFallback>
									</Avatar>
									<p className="text-lg font-medium">{newTitle || "جدید"}</p>
								</div>

								<Separator />

								{/* Add Section */}
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium mb-2">
											آپلود عکس
										</label>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) setNewImage(file);
											}}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											عنوان
										</label>
										<Input
											value={newTitle}
											onChange={(e) => setNewTitle(e.target.value)}
											placeholder="عنوان دسته بندی را وارد کنید"
										/>
									</div>
								</div>

								{/* Footer */}
								<div className="flex justify-center">
									<Button onClick={handleCreate}>ایجاد دسته بندی</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
				</>
			) : (
				<SubCatManager
					subcategories={subcategories}
					category={selectedCategoryForSubcats}
					onDataChange={handleSubcategoryDataChange}
				/>
			)}
		</div>
	);
}
