import { prisma } from "../../infrastructure/db/prisma.client";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.schema";

export const categoriesRepository = {
	// Category CRUD operations
	async getAllCategories() {
		return prisma.category.findMany({
			orderBy: { order: "asc" },
			include: {
				subCategories: {
					orderBy: { order: "asc" },
					include: {
						_count: {
							select: { products: true },
						},
					},
				},
				_count: {
					select: { subCategories: true },
				},
			},
		});
	},

	async getCategoryById(businessId: string) {
		return prisma.category.findUnique({
			where: { businessId },
		});
	},

	async getCategoryCount() {
		return prisma.category.count();
	},

	async createCategory(data: CreateCategoryInput) {
		return prisma.category.create({
			data: {
				title: data.title ?? "New Category",
				imageKey: data.imageKey,
			},
		});
	},

	async updateCategory(businessId: string, data: Partial<UpdateCategoryInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.imageKey !== undefined) updateData.imageKey = data.imageKey;

		return prisma.category.update({
			where: { businessId },
			data: updateData,
		});
	},

	async deleteCategory(businessId: string) {
		return prisma.category.delete({
			where: { businessId },
		});
	},

	// Category ordering operations
	async updateCategoriesOrder(startOrder: number, increment: boolean) {
		return prisma.category.updateMany({
			where: { order: increment ? { gte: startOrder } : { gt: startOrder } },
			data: { order: increment ? { increment: 1 } : { decrement: 1 } },
		});
	},

	async updateCategoriesOrderInRange(
		startOrder: number,
		endOrder: number,
		increment: boolean
	) {
		return prisma.category.updateMany({
			where: {
				order: increment
					? { gte: startOrder, lt: endOrder }
					: { gt: startOrder, lte: endOrder },
			},
			data: { order: increment ? { increment: 1 } : { decrement: 1 } },
		});
	},

	// Subcategory count operations
	async getSubCategoryCountByCategory(categoryId: string) {
		return prisma.subCategory.count({
			where: { categoryId },
		});
	},

	// Transaction operations
	async updateCategoryWithTransaction(
		businessId: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.category.update({
				where: { businessId },
				data,
			});
		});
	},

	async deleteCategoryWithTransaction(
		businessId: string,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.category.delete({ where: { businessId } });
		});
	},

	async reorderCategoriesTransaction(
		items: { businessId: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Update the order field for each category
			const updatePromises = items.map((item) =>
				tx.category.update({
					where: { businessId: item.businessId },
					data: { order: item.order },
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Get categories for reordering validation
	async getCategoriesForReorder() {
		return prisma.category.findMany({
			select: { businessId: true },
		});
	},

	async getCategoriesSimple() {
		return prisma.category.findMany({
			orderBy: { order: "asc" },
		});
	},

	// Image operations
	async updateCategoryImageKey(businessId: string, imageKey: string | null) {
		return prisma.category.update({
			where: { businessId },
			data: { imageKey },
		});
	},
};
