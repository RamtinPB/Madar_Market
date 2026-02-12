import { storageService } from "../../infrastructure/storage/s3.storage";
import { categoriesRepository } from "./categories.repository";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.schema";
import {
	createErrorResponse,
	NotFoundError,
	ValidationError,
} from "../../shared/errors/http-errors";

export class CategoryService {
	private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

	async getAllCategories() {
		const categories = await categoriesRepository.getAllCategories();
		return categories.map((cat) => ({
			...cat,
			imageUrl: cat.imageKey ? storageService.getPublicUrl(cat.imageKey) : null,
		}));
	}

	async getCategoryByPublicId(publicId: string) {
		const cat = await categoriesRepository.getCategoryByPublicId(publicId);
		if (!cat) throw new NotFoundError("Category");
		return cat;
	}

	async createNewCategory(data: CreateCategoryInput) {
		const total = await categoriesRepository.getCategoriesCount();
		const title = data.title ?? "New Category";

		return categoriesRepository.createNewCategory({
			...data,
			title,
		});
	}

	async updateCategory(publicId: string, data: UpdateCategoryInput) {
		const category = await this.getCategoryByPublicId(publicId);

		// Update the title and imageKey
		const updateData: any = {};
		if (data.title !== undefined) updateData.title = data.title;
		if (data.imageKey !== undefined) updateData.imageKey = data.imageKey;

		await categoriesRepository.updateCategory(publicId, updateData);

		return this.getCategoryByPublicId(publicId);
	}

	async deleteCategory(publicId: string) {
		const category = await this.getCategoryByPublicId(publicId);

		// Check if category has subcategories
		const subCategoryCount =
			await categoriesRepository.getSubCategoryCountByCategory(publicId);

		if (subCategoryCount > 0) {
			throw new ValidationError(
				"Cannot delete category with existing subcategories",
			);
		}

		// Delete image if exists
		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
		}

		await categoriesRepository.deleteCategoryWithTransaction(
			publicId,
			async (tx) => {
				// Image deletion handled above, no need in transaction
			},
		);

		return { success: true };
	}

	async deleteCategoryImage(publicId: string) {
		const category = await this.getCategoryByPublicId(publicId);

		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
			await categoriesRepository.updateCategoryImageKey(publicId, null);
		}

		return { success: true };
	}

	async getCategoryImageUploadUrl(publicId: string) {
		const key = storageService.generateCategoryImageKey(
			publicId,
			crypto.randomUUID() + ".webp",
		);

		// 3. Issue upload URL
		const uploadUrl = await storageService.getUploadUrl(key, "image/webp", 120);

		// 4. Save key in repository
		await categoriesRepository.updateCategoryImageKey(publicId, key);

		return { uploadUrl };
	}

	// Enhanced uploadImages with validation and error handling
	async uploadCategoryImage(publicId: string, image: File) {
		const category = await categoriesRepository.getCategoryByPublicId(publicId);

		if (image.size > this.MAX_FILE_SIZE) {
			throw new ValidationError(
				`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
			);
		}

		if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
			throw new ValidationError("Only JPEG, PNG, and WebP image are allowed");
		}

		if (category?.imageKey) {
			await storageService.deleteObject(category.imageKey);
		}

		const filename = `${crypto.randomUUID()}.webp`;
		const key = storageService.generateCategoryImageKey(publicId, filename);
		await storageService.uploadFile(key, image, "image/webp");

		// Save key in repository
		await categoriesRepository.updateCategoryImageKey(publicId, key);

		return {
			success: true,
			message: `Image uploaded successfully`,
		};
	}
}

export const categoryService = new CategoryService();
