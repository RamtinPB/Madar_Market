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

	async getById(id: string) {
		const cat = await categoriesRepository.getCategoryById(id);
		if (!cat) throw new NotFoundError("Category");
		return cat;
	}

	async create(data: CreateCategoryInput) {
		const total = await categoriesRepository.getCategoryCount();
		const order = data.order ?? total + 1;
		const title = data.title ?? "New Category";

		// Validate order against actual count
		if (order < 1 || order > total + 1) {
			throw new ValidationError(`Order must be between 1 and ${total + 1}`);
		}

		// shift existing items if necessary
		if (order <= total) {
			await categoriesRepository.updateCategoriesOrder(order, true);
		}

		return categoriesRepository.createCategory({
			...data,
			order,
			title,
		});
	}

	async update(id: string, data: UpdateCategoryInput) {
		const category = await this.getById(id);

		// if ordering changes, adjust neighbors
		if (data.order && data.order !== category.order) {
			const oldOrder = category.order;
			const newOrder = data.order;

			const maxOrder = await categoriesRepository.getCategoryCount();
			if (newOrder < 1 || newOrder > maxOrder) {
				throw new ValidationError(`Order must be between 1 and ${maxOrder}`);
			}

			await categoriesRepository.updateCategoryWithTransaction(
				id,
				{ title: data.title, order: newOrder },
				async (tx) => {
					if (newOrder < oldOrder) {
						await tx.category.updateMany({
							where: { order: { gte: newOrder, lt: oldOrder } },
							data: { order: { increment: 1 } },
						});
					} else {
						await tx.category.updateMany({
							where: { order: { gt: oldOrder, lte: newOrder } },
							data: { order: { decrement: 1 } },
						});
					}
				}
			);
		} else {
			// only updating title
			const updateData: any = {};
			if (data.title !== undefined) updateData.title = data.title;

			await categoriesRepository.updateCategory(id, updateData);
		}

		return this.getById(id);
	}

	async delete(id: string) {
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

		await categoriesRepository.deleteCategoryWithTransaction(
			id,
			{ order: category.order },
			async (tx) => {
				// Image deletion handled above, no need in transaction
			}
		);

		return { success: true };
	}

	async deleteImage(id: string) {
		const category = await this.getById(id);

		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
			await categoriesRepository.updateCategoryImageKey(id, null);
		}

		return { success: true };
	}

	async reorder(items: { id: string; order: number }[]) {
		const existing = await categoriesRepository.getCategoriesForReorder();

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

		await categoriesRepository.reorderCategoriesTransaction(
			items,
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
		await categoriesRepository.updateCategoryImageKey(categoryId, key);

		return { uploadUrl };
	}

	// Enhanced uploadImages with validation and error handling
	async uploadImage(categoryId: string, image: File) {
		const category = await categoriesRepository.getCategoryById(categoryId);

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
		await categoriesRepository.updateCategoryImageKey(categoryId, key);

		return {
			success: true,
			message: `${image} image uploaded successfully`,
		};
	}
}

export const categoryService = new CategoryService();
