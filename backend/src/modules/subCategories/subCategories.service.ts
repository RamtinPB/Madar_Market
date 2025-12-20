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

		const title = data.title ?? "New SubCategory";

		return subCategoriesRepository.createSubCategory({
			...data,
			id: total + 1, // Auto-generate ID
			title,
		});
	}

	async update(id: string, data: UpdateSubCategoryInput) {
		const subCategory = await this.getById(id);

		// if categoryId changes, update both categories
		if (
			data.categoryId &&
			data.categoryId !== subCategory.categoryId.toString()
		) {
			// Check new category exists
			const newCategory = await subCategoriesRepository.getCategoryById(
				data.categoryId
			);
			if (!newCategory) throw new Error("CATEGORY_NOT_FOUND");

			const updateData = {
				...(data.title !== undefined && { title: data.title }),
				categoryId: data.categoryId,
			};

			await subCategoriesRepository.updateSubCategory(id, updateData);
		} else {
			// Same category, handle title update only
			const updateData: any = {};
			if (data.title !== undefined) updateData.title = data.title;

			await subCategoriesRepository.updateSubCategory(id, updateData);
		}

		return this.getById(id);
	}

	async delete(id: string) {
		// Check if subcategory has products
		const productCount =
			await subCategoriesRepository.getProductCountBySubCategory(id);

		if (productCount > 0) {
			throw new Error("CANNOT_DELETE_SUBCATEGORY_WITH_PRODUCTS");
		}

		await subCategoriesRepository.deleteSubCategoryWithTransaction(
			id,
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

		// Since we're using ID-based ordering, we don't need to actually reorder anything
		// The frontend can sort by ID when displaying
		// Just validate that the provided IDs are valid
		const numericItems = items.map((item) => ({
			id: item.id,
			order: item.order,
		}));

		await subCategoriesRepository.reorderSubCategoriesTransaction(
			categoryId,
			numericItems,
			async (tx) => {
				// Validation completed above, no additional transaction work needed
			}
		);

		return subCategoriesRepository.getSubCategoriesByCategorySimple(categoryId);
	}
}

export const subCategoryService = new SubCategoryService();
