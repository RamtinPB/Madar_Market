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

	async getById(businessId: string) {
		const subCat = await subCategoriesRepository.getSubCategoryById(businessId);
		if (!subCat) throw new Error("NOT_FOUND");
		return subCat;
	}

	async create(data: CreateSubCategoryInput) {
		// Check if category exists
		const category = await subCategoriesRepository.getCategoryById(
			data.categoryId
		);
		if (!category) throw new Error("CATEGORY_NOT_FOUND");

		const title = data.title ?? "New SubCategory";

		return subCategoriesRepository.createSubCategory({
			...data,
			title,
		});
	}

	async update(businessId: string, data: UpdateSubCategoryInput) {
		const subCategory = await this.getById(businessId);

		// if categoryId changes, update both categories
		if (data.categoryId && data.categoryId !== subCategory.categoryId) {
			// Check new category exists
			const newCategory = await subCategoriesRepository.getCategoryById(
				data.categoryId
			);
			if (!newCategory) throw new Error("CATEGORY_NOT_FOUND");

			const updateData = {
				...(data.title !== undefined && { title: data.title }),
				categoryId: data.categoryId,
			};

			await subCategoriesRepository.updateSubCategory(businessId, updateData);
		} else {
			// Same category, handle title update only
			const updateData: any = {};
			if (data.title !== undefined) updateData.title = data.title;

			await subCategoriesRepository.updateSubCategory(businessId, updateData);
		}

		return this.getById(businessId);
	}

	async delete(businessId: string) {
		// Check if subcategory has products
		const productCount =
			await subCategoriesRepository.getProductCountBySubCategory(businessId);

		if (productCount > 0) {
			throw new Error("CANNOT_DELETE_SUBCATEGORY_WITH_PRODUCTS");
		}

		await subCategoriesRepository.deleteSubCategoryWithTransaction(
			businessId,
			async (tx) => {
				// No additional transaction work needed
			}
		);

		return { success: true };
	}

	async reorder(
		categoryId: string,
		items: { businessId: string; order: number }[]
	) {
		const existing =
			await subCategoriesRepository.getSubCategoriesByCategoryForReorder(
				categoryId
			);

		if (existing.length !== items.length) {
			throw new Error("MISMATCH_COUNT");
		}

		const existingIds = new Set(existing.map((x) => x.businessId));
		const providedIds = new Set(items.map((x) => x.businessId));

		if (existingIds.size !== providedIds.size) {
			throw new Error("INVALID_IDS");
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
