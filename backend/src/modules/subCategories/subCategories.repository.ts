import { prisma } from "../../infrastructure/db/prisma.client";
import type {
	CreateSubCategoryInput,
	UpdateSubCategoryInput,
} from "./subCategories.schema";

export const subCategoriesRepository = {
	// SubCategory CRUD operations
	async getAllByCategory(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId: Number(categoryId) },
			orderBy: { id: "asc" },
		});
	},

	async getSubCategoryById(id: string) {
		return prisma.subCategory.findUnique({
			where: { id: Number(id) },
		});
	},

	async getSubCategoryCountByCategory(categoryId: string) {
		return prisma.subCategory.count({
			where: { categoryId: Number(categoryId) },
		});
	},

	async createSubCategory(data: CreateSubCategoryInput & { id: number }) {
		return prisma.subCategory.create({
			data: {
				title: data.title ?? "New SubCategory",
				categoryId: Number(data.categoryId),
				id: data.id,
			},
		});
	},

	async updateSubCategory(id: string, data: Partial<UpdateSubCategoryInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.categoryId !== undefined)
			updateData.categoryId = Number(data.categoryId);

		return prisma.subCategory.update({
			where: { id: Number(id) },
			data: updateData,
		});
	},

	async deleteSubCategory(id: string) {
		return prisma.subCategory.delete({
			where: { id: Number(id) },
		});
	},

	// Category operations
	async getCategoryById(categoryId: string) {
		return prisma.category.findUnique({
			where: { id: Number(categoryId) },
		});
	},

	// Product count operations
	async getProductCountBySubCategory(subCategoryId: string) {
		return prisma.product.count({
			where: { subCategoryId: Number(subCategoryId) },
		});
	},

	// Transaction operations
	async updateSubCategoryWithTransaction(
		id: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.subCategory.update({
				where: { id: Number(id) },
				data,
			});
		});
	},

	async deleteSubCategoryWithTransaction(
		id: string,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.subCategory.delete({ where: { id: Number(id) } });
		});
	},

	async reorderSubCategoriesTransaction(
		categoryId: string,
		items: { id: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Since we're using ID-based ordering, no actual reordering is needed
			// The frontend can sort by ID when displaying
			const updatePromises = items.map((item) =>
				tx.subCategory.update({
					where: { id: Number(item.id) },
					data: {}, // No data to update since ordering is by ID
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Get subcategories for reordering validation
	async getSubCategoriesByCategoryForReorder(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId: Number(categoryId) },
			select: { id: true },
		});
	},

	async getSubCategoriesByCategorySimple(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId: Number(categoryId) },
			orderBy: { id: "asc" },
		});
	},
};
