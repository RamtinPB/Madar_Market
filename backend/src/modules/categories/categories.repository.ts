import { prisma } from "../../infrastructure/db/prisma.client";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.schema";

export const categoriesRepository = {
	// Category CRUD operations
	async getAllCategories() {
		return prisma.category.findMany({
			orderBy: { createdAt: "asc" },
			include: {
				subCategories: {
					orderBy: { createdAt: "asc" },
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

	async getCategoryByPublicId(publicId: string) {
		return prisma.category.findUnique({
			where: { publicId },
		});
	},

	async getCategoriesCount() {
		return prisma.category.count();
	},

	async createNewCategory(data: CreateCategoryInput) {
		return prisma.category.create({
			data: {
				title: data.title ?? "New Category",
				imageKey: data.imageKey,
			},
		});
	},

	async updateCategory(publicId: string, data: Partial<UpdateCategoryInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.imageKey !== undefined) updateData.imageKey = data.imageKey;

		return prisma.category.update({
			where: { publicId },
			data: updateData,
		});
	},

	async deleteCategory(publicId: string) {
		return prisma.category.delete({
			where: { publicId },
		});
	},

	// Subcategory count operations
	async getSubCategoryCountByCategory(publicId: string) {
		const category = await prisma.category.findUnique({
			where: { publicId },
			select: { id: true },
		});
		if (!category) return 0;

		return prisma.subCategory.count({
			where: { categoryId: category.id },
		});
	},

	async deleteCategoryWithTransaction(
		publicId: string,
		transactionCallback: (tx: any) => Promise<void>,
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			await tx.category.delete({ where: { publicId } });
		});
	},

	async getCategoriesSimple() {
		return prisma.category.findMany({
			orderBy: { createdAt: "asc" },
		});
	},

	// Image operations
	async updateCategoryImageKey(publicId: string, imageKey: string | null) {
		return prisma.category.update({
			where: { publicId },
			data: { imageKey },
		});
	},
};
