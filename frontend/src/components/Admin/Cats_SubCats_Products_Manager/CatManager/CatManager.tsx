"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/src/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { Separator } from "@/src/components/ui/separator";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/components/ui/pagination";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import { CategoriesAPI, Category } from "@/src/lib/api/categories";
import { Edit, Trash2, Plus } from "lucide-react";

export default function CatManager() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null
	);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedImage, setEditedImage] = useState<File | null>(null);

	const itemsPerPage = 10;

	useEffect(() => {
		loadCategories();
	}, []);

	useEffect(() => {
		const filtered = categories.filter((category) =>
			category.title.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredCategories(filtered);
		setCurrentPage(1);
	}, [categories, searchTerm]);

	const loadCategories = async () => {
		try {
			setLoading(true);
			const data = await CategoriesAPI.getAll();
			setCategories(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load categories"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this category?")) return;

		try {
			await CategoriesAPI.delete(id);
			await loadCategories();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete category"
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

	const handleAdd = async () => {
		// Placeholder for create
		try {
			await CategoriesAPI.create({ title: "New Category" });
			await loadCategories();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create category"
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
					editedImage
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
				err instanceof Error ? err.message : "Failed to update category"
			);
		}
	};

	const paginatedCategories = filteredCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="flex flex-col gap-4 p-4" dir="rtl">
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
						<TableHead className="text-right">شناسه</TableHead>
						<TableHead className="text-right">تیتر</TableHead>
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
									<AvatarFallback>{category.title.charAt(0)}</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell>{category.id}</TableCell>
							<TableCell>{category.title}</TableCell>
							<TableCell>
								{new Date(category.createdAt).toLocaleDateString()}
							</TableCell>
							<TableCell>
								{new Date(category.updatedAt).toLocaleDateString()}
							</TableCell>
							<TableCell>
								<div className="flex gap-5">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(category)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(category.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
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
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									onClick={() => setCurrentPage(page)}
									isActive={currentPage === page}
									className="cursor-pointer"
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() =>
									currentPage < totalPages && setCurrentPage(currentPage + 1)
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
							<Avatar className="w-24 h-24">
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
							<p className="text-lg font-medium">{editedTitle}</p>
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
								<label className="block text-sm font-medium mb-2">تیتر</label>
								<Input
									value={editedTitle}
									onChange={(e) => setEditedTitle(e.target.value)}
									placeholder="Enter category title"
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
		</div>
	);
}
