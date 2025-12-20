// src/modules/subCategories/subCategories.service.ts
import { productService } from "../product/products.service";
import { subCategoriesRepository } from "./subCategories.repository";
import type {
	CreateSubCategoryInput,
	UpdateSubCategoryInput,
} from "./subCategories.schema";

export class SubCategoryService {
	async getAllByCategory(categoryId: string) {
		return subCategoriesRepository.getAllByCategory(categoryId);
	}

	async getAllProducts(subCategoryId: string) {
		return await productService.getAllBySubCategory(subCategoryId);
	}

	async getById(id: string) {
		const subCat = await subCategoriesRepository.getSubCategoryById(id);
		if (!subCat) throw new Error("NOT_FOUND");
		return subCat;
	}

	async create(data: CreateSubCategoryInput) {
		// Check if category exists
		const category = await subCategoriesRepository.getCategoryById(
			data.categoryId
		);
		if (!category) throw new Error("CATEGORY_NOT_FOUND");

		const total = await subCategoriesRepository.getSubCategoryCountByCategory(
			data.categoryId
		);

		const order = data.order ?? total + 1;
		const title = data.title ?? "New SubCategory";

		if (order > total + 1) {
			throw new Error("INVALID_ORDER");
		}

		// shift existing items if necessary
		if (order <= total) {
			await subCategoriesRepository.updateSubCategoriesOrder(
				data.categoryId,
				order,
				true
			);
		}

		return subCategoriesRepository.createSubCategory({
			...data,
			order,
			title,
		});
	}

	async update(id: string, data: UpdateSubCategoryInput) {
		const subCategory = await this.getById(id);

		// if categoryId changes, need to handle order in both categories
		if (data.categoryId && data.categoryId !== subCategory.categoryId) {
			// Check new category exists
			const newCategory = await subCategoriesRepository.getCategoryById(
				data.categoryId
			);
			if (!newCategory) throw new Error("CATEGORY_NOT_FOUND");

			// Remove from old category order
			await subCategoriesRepository.updateSubCategoriesOrder(
				subCategory.categoryId,
				subCategory.order,
				false
			);

			// Add to new category
			const newTotal =
				await subCategoriesRepository.getSubCategoryCountByCategory(
					data.categoryId
				);
			const newOrder = data.order ?? newTotal + 1;

			const updateData = {
				...(data.title !== undefined && { title: data.title }),
				categoryId: data.categoryId,
				order: newOrder,
			};

			await subCategoriesRepository.updateSubCategory(id, updateData);
		} else {
			// Same category, handle order change
			if (data.order && data.order !== subCategory.order) {
				const oldOrder = subCategory.order;
				const newOrder = data.order;

				const maxOrder =
					await subCategoriesRepository.getSubCategoryCountByCategory(
						subCategory.categoryId
					);
				if (newOrder < 1 || newOrder > maxOrder) {
					throw new Error("INVALID_ORDER");
				}

				const updateData = {
					...(data.title !== undefined && { title: data.title }),
					order: newOrder,
				};

				await subCategoriesRepository.updateSubCategoryWithTransaction(
					id,
					updateData,
					async (tx) => {
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
					}
				);
			} else {
				// only updating title
				const updateData: any = {};
				if (data.title !== undefined) updateData.title = data.title;

				await subCategoriesRepository.updateSubCategory(id, updateData);
			}
		}

		return this.getById(id);
	}

	async delete(id: string) {
		const subCategory = await this.getById(id);

		// Check if subcategory has products
		const productCount =
			await subCategoriesRepository.getProductCountBySubCategory(id);

		if (productCount > 0) {
			throw new Error("CANNOT_DELETE_SUBCATEGORY_WITH_PRODUCTS");
		}

		await subCategoriesRepository.deleteSubCategoryWithTransaction(
			id,
			{ categoryId: subCategory.categoryId, order: subCategory.order },
			async (tx) => {
				// No additional transaction work needed
			}
		);

		return { success: true };
	}

	async reorder(categoryId: string, items: { id: string; order: number }[]) {
		const existing =
			await subCategoriesRepository.getSubCategoriesByCategoryForReorder(
				categoryId
			);

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

		await subCategoriesRepository.reorderSubCategoriesTransaction(
			categoryId,
			items,
			async (tx) => {
				// Validation completed above, no additional transaction work needed
			}
		);

		return subCategoriesRepository.getSubCategoriesByCategorySimple(categoryId);
	}
}

export const subCategoryService = new SubCategoryService();
