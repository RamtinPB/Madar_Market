import { prisma } from "../../infrastructure/db/prisma.client";
import type {
	CreateSubCategoryInput,
	UpdateSubCategoryInput,
} from "./subCategories.schema";

export const subCategoriesRepository = {
	// SubCategory CRUD operations
	async getAllByCategory(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId },
			orderBy: { order: "asc" },
		});
	},

	async getSubCategoryById(businessId: string) {
		return prisma.subCategory.findUnique({
			where: { businessId },
		});
	},

	async getSubCategoryCountByCategory(categoryId: string) {
		return prisma.subCategory.count({
			where: { categoryId },
		});
	},

	async createSubCategory(data: CreateSubCategoryInput) {
		return prisma.subCategory.create({
			data: {
				title: data.title ?? "New SubCategory",
				categoryId: data.categoryId,
			},
		});
	},

	async updateSubCategory(
		businessId: string,
		data: Partial<UpdateSubCategoryInput>
	) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

		return prisma.subCategory.update({
			where: { businessId },
			data: updateData,
		});
	},

	async deleteSubCategory(businessId: string) {
		return prisma.subCategory.delete({
			where: { businessId },
		});
	},

	// Category operations
	async getCategoryById(categoryId: string) {
		return prisma.category.findUnique({
			where: { businessId: categoryId },
		});
	},

	// Product count operations
	async getProductCountBySubCategory(subCategoryId: string) {
		return prisma.product.count({
			where: { subCategoryId },
		});
	},

	// Transaction operations
	async updateSubCategoryWithTransaction(
		businessId: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.subCategory.update({
				where: { businessId },
				data,
			});
		});
	},

	async deleteSubCategoryWithTransaction(
		businessId: string,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.subCategory.delete({ where: { businessId } });
		});
	},

	async reorderSubCategoriesTransaction(
		categoryId: string,
		items: { businessId: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Update the order field for each subcategory
			const updatePromises = items.map((item) =>
				tx.subCategory.update({
					where: { businessId: item.businessId },
					data: { order: item.order },
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Get subcategories for reordering validation
	async getSubCategoriesByCategoryForReorder(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId },
			select: { businessId: true },
		});
	},

	async getSubCategoriesByCategorySimple(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId },
			orderBy: { order: "asc" },
		});
	},
};
