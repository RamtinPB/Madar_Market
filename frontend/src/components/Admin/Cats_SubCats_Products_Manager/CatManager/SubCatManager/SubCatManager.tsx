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
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/src/components/ui/pagination";
import { SubCategoriesAPI, SubCategory } from "@/src/lib/api/subcategories";
import { CategoriesAPI, Category } from "@/src/lib/api/categories";
import { Edit, Trash2, Plus } from "lucide-react";

interface SubCatManagerProps {
	subcategories: SubCategory[];
	category: Category | null;
	onDataChange: () => void;
}

export default function SubCatManager({
	subcategories,
	category,
	onDataChange,
}: SubCatManagerProps) {
	const [filteredSubCategories, setFilteredSubCategories] = useState<
		SubCategory[]
	>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [selectedSubCategory, setSelectedSubCategory] =
		useState<SubCategory | null>(null);
	const [editedTitle, setEditedTitle] = useState("");
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");

	const itemsPerPage = 10;

	useEffect(() => {
		setFilteredSubCategories(subcategories);
		setCurrentPage(1);
	}, [subcategories]);

	useEffect(() => {
		const filtered = subcategories.filter(
			(subCategory) =>
				subCategory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				subCategory.id.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredSubCategories(filtered);
		setCurrentPage(1);
	}, [subcategories, searchTerm]);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this subcategory?")) return;

		try {
			await SubCategoriesAPI.delete(id);
			onDataChange();
		} catch (err) {
			console.error("Failed to delete subcategory", err);
		}
	};

	const handleEdit = (subCategory: SubCategory) => {
		setSelectedSubCategory(subCategory);
		setEditedTitle(subCategory.title);
		setEditDialogOpen(true);
	};

	const handleAdd = () => {
		setNewTitle("");
		setAddDialogOpen(true);
	};

	const handleCreate = async () => {
		try {
			await SubCategoriesAPI.create({
				title: newTitle,
				categoryId: category?.id!,
			});
			onDataChange();
			setAddDialogOpen(false);
		} catch (err) {
			console.error("Failed to create subcategory", err);
		}
	};

	const handleApply = async () => {
		if (!selectedSubCategory) return;

		try {
			if (editedTitle !== selectedSubCategory.title) {
				await SubCategoriesAPI.update(selectedSubCategory.id, {
					title: editedTitle,
				});
			}
			onDataChange();
			setEditDialogOpen(false);
		} catch (err) {
			console.error("Failed to update subcategory", err);
		}
	};

	const paginatedSubCategories = filteredSubCategories.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);

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
					اضافه کردن زیر دسته
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-right">شناسه زیردسته</TableHead>
						<TableHead className="text-right">عنوان زیردسته</TableHead>
						<TableHead className="text-right">تاریخ ساخت</TableHead>
						<TableHead className="text-right">تاریخ آخرین ویرایش</TableHead>
						<TableHead className="text-right">عملیات</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedSubCategories.map((subCategory) => (
						<TableRow key={subCategory.id}>
							<TableCell>{subCategory.id}</TableCell>
							<TableCell>{subCategory.title}</TableCell>
							<TableCell>
								{new Date(subCategory.createdAt).toLocaleDateString()}
							</TableCell>
							<TableCell>
								{new Date(subCategory.updatedAt).toLocaleDateString()}
							</TableCell>
							<TableCell>
								<div className="flex gap-5">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(subCategory)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(subCategory.id)}
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
					<DialogHeader>
						<DialogTitle>ویرایش زیر دسته</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-2">عنوان</label>
							<Input
								value={editedTitle}
								onChange={(e) => setEditedTitle(e.target.value)}
								placeholder="Enter subcategory title"
							/>
						</div>
						<div className="flex justify-center">
							<Button onClick={handleApply}>اعمال تغییرات</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Add Dialog */}
			<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>ایجاد زیر دسته</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-2">عنوان</label>
							<Input
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								placeholder="Enter subcategory title"
							/>
						</div>
						<div className="flex justify-center">
							<Button onClick={handleCreate}>ایجاد زیر دسته</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
