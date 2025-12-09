// src/modules/subCategories/subCategories.service.ts
import { prisma } from "../../utils/prisma";
import type {
	CreateSubCategoryInput,
	UpdateSubCategoryInput,
} from "./subCategories.types";

export class SubCategoryService {
	async getAllByCategory(categoryId: string) {
		return prisma.subCategory.findMany({
			where: { categoryId },
			orderBy: { order: "asc" },
		});
	}

	async getById(id: string) {
		const subCat = await prisma.subCategory.findUnique({ where: { id } });
		if (!subCat) throw new Error("NOT_FOUND");
		return subCat;
	}

	async create(data: CreateSubCategoryInput) {
		// Check if category exists
		const category = await prisma.category.findUnique({
			where: { id: data.categoryId },
		});
		if (!category) throw new Error("CATEGORY_NOT_FOUND");

		const total = await prisma.subCategory.count({
			where: { categoryId: data.categoryId },
		});

		const order = data.order ?? total + 1;
		const title = data.title ?? "New SubCategory";

		if (order > total + 1) {
			throw new Error("INVALID_ORDER");
		}

		// shift existing items if necessary
		if (order <= total) {
			await prisma.subCategory.updateMany({
				where: {
					categoryId: data.categoryId,
					order: { gte: order },
				},
				data: { order: { increment: 1 } },
			});
		}

		return prisma.subCategory.create({
			data: {
				title,
				categoryId: data.categoryId,
				order,
			},
		});
	}

	async update(id: string, data: UpdateSubCategoryInput) {
		const subCategory = await this.getById(id);

		// if categoryId changes, need to handle order in both categories
		if (data.categoryId && data.categoryId !== subCategory.categoryId) {
			// Check new category exists
			const newCategory = await prisma.category.findUnique({
				where: { id: data.categoryId },
			});
			if (!newCategory) throw new Error("CATEGORY_NOT_FOUND");

			// Remove from old category order
			await prisma.subCategory.updateMany({
				where: {
					categoryId: subCategory.categoryId,
					order: { gt: subCategory.order },
				},
				data: { order: { decrement: 1 } },
			});

			// Add to new category
			const newTotal = await prisma.subCategory.count({
				where: { categoryId: data.categoryId },
			});
			const newOrder = data.order ?? newTotal + 1;

			await prisma.subCategory.update({
				where: { id },
				data: {
					title: data.title ?? undefined,
					categoryId: data.categoryId,
					order: newOrder,
				},
			});
		} else {
			// Same category, handle order change
			if (data.order && data.order !== subCategory.order) {
				const oldOrder = subCategory.order;
				const newOrder = data.order;

				const maxOrder = await prisma.subCategory.count({
					where: { categoryId: subCategory.categoryId },
				});
				if (newOrder < 1 || newOrder > maxOrder) {
					throw new Error("INVALID_ORDER");
				}

				await prisma.$transaction(async (tx) => {
					if (newOrder < oldOrder) {
						await tx.subCategory.updateMany({
							where: {
								categoryId: subCategory.categoryId,
								order: { gte: newOrder, lt: oldOrder },
							},
							data: { order: { increment: 1 } },
						});
					} else {
						await tx.subCategory.updateMany({
							where: {
								categoryId: subCategory.categoryId,
								order: { gt: oldOrder, lte: newOrder },
							},
							data: { order: { decrement: 1 } },
						});
					}

					await tx.subCategory.update({
						where: { id },
						data: {
							title: data.title ?? undefined,
							order: newOrder,
						},
					});
				});
			} else {
				// only updating title
				await prisma.subCategory.update({
					where: { id },
					data: {
						title: data.title ?? undefined,
					},
				});
			}
		}

		return this.getById(id);
	}

	async delete(id: string) {
		const subCategory = await this.getById(id);

		// Check if subcategory has products
		const productCount = await prisma.product.count({
			where: { subCategoryId: id },
		});

		if (productCount > 0) {
			throw new Error("CANNOT_DELETE_SUBCATEGORY_WITH_PRODUCTS");
		}

		await prisma.$transaction(async (tx) => {
			await tx.subCategory.delete({ where: { id } });

			// shift down remaining items in the same category
			await tx.subCategory.updateMany({
				where: {
					categoryId: subCategory.categoryId,
					order: { gt: subCategory.order },
				},
				data: { order: { decrement: 1 } },
			});
		});

		return { success: true };
	}

	async reorder(categoryId: string, items: { id: string; order: number }[]) {
		const existing = await prisma.subCategory.findMany({
			where: { categoryId },
			select: { id: true },
		});

		if (existing.length !== items.length) {
			throw new Error("MISMATCH_COUNT");
		}

		const existingIds = new Set(existing.map((x) => x.id));
		const providedIds = new Set(items.map((x) => x.id));

		if (existingIds.size !== providedIds.size) {
			throw new Error("INVALID_IDS");
		}

		const orders = items.map((x) => x.order);
		const uniqueOrders = new Set(orders);

		if (uniqueOrders.size !== orders.length) {
			throw new Error("DUPLICATE_ORDER");
		}

		const max = existing.length;
		for (const o of orders) {
			if (o < 1 || o > max) throw new Error("OUT_OF_RANGE");
		}

		await prisma.$transaction(async (tx) => {
			for (const item of items) {
				await tx.subCategory.update({
					where: { id: item.id },
					data: { order: item.order },
				});
			}
		});

		return prisma.subCategory.findMany({
			where: { categoryId },
			orderBy: { order: "asc" },
		});
	}
}

export const subCategoryService = new SubCategoryService();
