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

	async getAll() {
		const categories = await categoriesRepository.getAllCategories();
		return categories.map((cat) => ({
			...cat,
			imageUrl: cat.imageKey ? storageService.getPublicUrl(cat.imageKey) : null,
		}));
	}

	async getById(id: number) {
		const cat = await categoriesRepository.getCategoryById(id);
		if (!cat) throw new NotFoundError("Category");
		return cat;
	}

	async create(data: CreateCategoryInput) {
		const total = await categoriesRepository.getCategoryCount();
		const title = data.title ?? "New Category";

		return categoriesRepository.createCategory({
			...data,
			title,
			id: total + 1, // Auto-generate ID
		});
	}

	async update(id: number, data: UpdateCategoryInput) {
		const category = await this.getById(id);

		// Update only the title (order is now handled by ID)
		const updateData: any = {};
		if (data.title !== undefined) updateData.title = data.title;

		await categoriesRepository.updateCategory(id, updateData);

		return this.getById(id);
	}

	async delete(id: number) {
		const category = await this.getById(id);

		// Check if category has subcategories
		const subCategoryCount =
			await categoriesRepository.getSubCategoryCountByCategory(id);

		if (subCategoryCount > 0) {
			throw new ValidationError(
				"Cannot delete category with existing subcategories"
			);
		}

		// Delete image if exists
		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
		}

		await categoriesRepository.deleteCategoryWithTransaction(id, async (tx) => {
			// Image deletion handled above, no need in transaction
		});

		return { success: true };
	}

	async deleteImage(id: number) {
		const category = await this.getById(id);

		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
			await categoriesRepository.updateCategoryImageKey(id, null);
		}

		return { success: true };
	}

	async reorder(items: { id: number; order: number }[]) {
		const existing = await categoriesRepository.getCategoriesForReorder();

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
			id: Number(item.id),
			order: item.order,
		}));

		await categoriesRepository.reorderCategoriesTransaction(
			numericItems,
			async (tx) => {
				// Validation completed above, no additional transaction work needed
			}
		);

		return categoriesRepository.getCategoriesSimple();
	}

	async getCategoryImageUploadUrl(categoryId: string) {
		const key = storageService.generateCategoryImageKey(
			categoryId,
			crypto.randomUUID() + ".webp"
		);

		// 3. Issue upload URL
		const uploadUrl = await storageService.getUploadUrl(key, "image/webp", 120);

		// 4. Save key in repository
		await categoriesRepository.updateCategoryImageKey(Number(categoryId), key);

		return { uploadUrl };
	}

	// Enhanced uploadImages with validation and error handling
	async uploadImage(categoryId: string, image: File) {
		const category = await categoriesRepository.getCategoryById(
			Number(categoryId)
		);

		if (image.size > this.MAX_FILE_SIZE) {
			throw new ValidationError(
				`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`
			);
		}

		if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
			throw new ValidationError("Only JPEG, PNG, and WebP image are allowed");
		}

		if (category?.imageKey) {
			await storageService.deleteObject(category.imageKey);
		}

		const filename = `${crypto.randomUUID()}.webp`;
		const key = storageService.generateCategoryImageKey(categoryId, filename);
		await storageService.uploadFile(key, image, "image/webp");

		// Save key in repository
		await categoriesRepository.updateCategoryImageKey(Number(categoryId), key);

		return {
			success: true,
			message: `${image} image uploaded successfully`,
		};
	}
}

export const categoryService = new CategoryService();
