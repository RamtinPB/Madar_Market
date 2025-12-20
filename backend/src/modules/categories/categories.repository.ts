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

	async getCategoryById(id: string) {
		return prisma.category.findUnique({
			where: { id },
		});
	},

	async getCategoryCount() {
		return prisma.category.count();
	},

	async createCategory(data: CreateCategoryInput & { order: number }) {
		return prisma.category.create({
			data: {
				title: data.title ?? "New Category",
				order: data.order,
			},
		});
	},

	async updateCategory(id: string, data: Partial<UpdateCategoryInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.order !== undefined) updateData.order = data.order;

		return prisma.category.update({
			where: { id },
			data: updateData,
		});
	},

	async deleteCategory(id: string) {
		return prisma.category.delete({
			where: { id },
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
		id: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.category.update({
				where: { id },
				data,
			});
		});
	},

	async deleteCategoryWithTransaction(
		id: string,
		categoryData: { order: number },
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.category.delete({ where: { id } });

			// shift down remaining items
			await tx.category.updateMany({
				where: { order: { gt: categoryData.order } },
				data: { order: { decrement: 1 } },
			});
		});
	},

	async reorderCategoriesTransaction(
		items: { id: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			const updatePromises = items.map((item) =>
				tx.category.update({
					where: { id: item.id },
					data: { order: item.order },
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Get categories for reordering validation
	async getCategoriesForReorder() {
		return prisma.category.findMany({
			select: { id: true },
		});
	},

	async getCategoriesSimple() {
		return prisma.category.findMany({
			orderBy: { order: "asc" },
		});
	},

	// Image operations
	async updateCategoryImageKey(id: string, imageKey: string | null) {
		return prisma.category.update({
			where: { id },
			data: { imageKey },
		});
	},
};
