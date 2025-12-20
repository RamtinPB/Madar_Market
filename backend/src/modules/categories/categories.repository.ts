import { prisma } from "../../infrastructure/db/prisma.client";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.schema";

export const categoriesRepository = {
	// Category CRUD operations
	async getAllCategories() {
		return prisma.category.findMany({
			orderBy: { id: "asc" },
			include: {
				subCategories: {
					orderBy: { id: "asc" },
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

	async getCategoryById(id: number) {
		return prisma.category.findUnique({
			where: { id },
		});
	},

	async getCategoryCount() {
		return prisma.category.count();
	},

	async createCategory(data: CreateCategoryInput & { id: number }) {
		return prisma.category.create({
			data: {
				title: data.title ?? "New Category",
				id: data.id,
			},
		});
	},

	async updateCategory(id: number, data: Partial<UpdateCategoryInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;

		return prisma.category.update({
			where: { id },
			data: updateData,
		});
	},

	async deleteCategory(id: number) {
		return prisma.category.delete({
			where: { id },
		});
	},

	// // Category ordering operations
	// async updateCategoriesOrder(startOrder: number, increment: boolean) {
	// 	return prisma.category.updateMany({
	// 		where: { order: increment ? { gte: startOrder } : { gt: startOrder } },
	// 		data: { order: increment ? { increment: 1 } : { decrement: 1 } },
	// 	});
	// },

	// async updateCategoriesOrderInRange(
	// 	startOrder: number,
	// 	endOrder: number,
	// 	increment: boolean
	// ) {
	// 	return prisma.category.updateMany({
	// 		where: {
	// 			order: increment
	// 				? { gte: startOrder, lt: endOrder }
	// 				: { gt: startOrder, lte: endOrder },
	// 		},
	// 		data: { order: increment ? { increment: 1 } : { decrement: 1 } },
	// 	});
	// },

	// Subcategory count operations
	async getSubCategoryCountByCategory(categoryId: number) {
		return prisma.subCategory.count({
			where: { categoryId },
		});
	},

	// Transaction operations
	async updateCategoryWithTransaction(
		id: number,
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
		id: number,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.category.delete({ where: { id } });
		});
	},

	async reorderCategoriesTransaction(
		items: { id: number; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Since we're using ID-based ordering, no actual reordering is needed
			// The frontend can sort by ID when displaying
			const updatePromises = items.map((item) =>
				tx.category.update({
					where: { id: item.id },
					data: {}, // No data to update since ordering is by ID
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
			orderBy: { id: "asc" },
		});
	},

	// Image operations
	async updateCategoryImageKey(id: number, imageKey: string | null) {
		return prisma.category.update({
			where: { id },
			data: { imageKey },
		});
	},
};
