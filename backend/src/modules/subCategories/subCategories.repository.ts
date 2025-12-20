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

	async getSubCategoryById(id: string) {
		return prisma.subCategory.findUnique({
			where: { id },
		});
	},

	async getSubCategoryCountByCategory(categoryId: string) {
		return prisma.subCategory.count({
			where: { categoryId },
		});
	},

	async createSubCategory(data: CreateSubCategoryInput & { order: number }) {
		return prisma.subCategory.create({
			data: {
				title: data.title ?? "New SubCategory",
				categoryId: data.categoryId,
				order: data.order,
			},
		});
	},

	async updateSubCategory(id: string, data: Partial<UpdateSubCategoryInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
		if (data.order !== undefined) updateData.order = data.order;

		return prisma.subCategory.update({
			where: { id },
			data: updateData,
		});
	},

	async deleteSubCategory(id: string) {
		return prisma.subCategory.delete({
			where: { id },
		});
	},

	// SubCategory ordering operations
	async updateSubCategoriesOrder(
		categoryId: string,
		order: number,
		increment: boolean
	) {
		return prisma.subCategory.updateMany({
			where: {
				categoryId,
				order: increment ? { gte: order } : { gt: order },
			},
			data: { order: increment ? { increment: 1 } : { decrement: 1 } },
		});
	},

	async updateSubCategoriesOrderInRange(
		categoryId: string,
		startOrder: number,
		endOrder: number,
		increment: boolean
	) {
		return prisma.subCategory.updateMany({
			where: {
				categoryId,
				order: increment
					? { gte: startOrder, lt: endOrder }
					: { gt: startOrder, lte: endOrder },
			},
			data: { order: increment ? { increment: 1 } : { decrement: 1 } },
		});
	},

	// Category operations
	async getCategoryById(categoryId: string) {
		return prisma.category.findUnique({
			where: { id: categoryId },
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
		id: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.subCategory.update({
				where: { id },
				data,
			});
		});
	},

	async deleteSubCategoryWithTransaction(
		id: string,
		subCategoryData: { categoryId: string; order: number },
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.subCategory.delete({ where: { id } });

			// shift down remaining items in the same category
			await tx.subCategory.updateMany({
				where: {
					categoryId: subCategoryData.categoryId,
					order: { gt: subCategoryData.order },
				},
				data: { order: { decrement: 1 } },
			});
		});
	},

	async reorderSubCategoriesTransaction(
		categoryId: string,
		items: { id: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			const updatePromises = items.map((item) =>
				tx.subCategory.update({
					where: { id: item.id },
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
			select: { id: true },
		});
	},

	async getSubCategoriesByCategorySimple(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId },
			orderBy: { order: "asc" },
		});
	},
};
