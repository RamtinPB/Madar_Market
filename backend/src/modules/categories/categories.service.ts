import { prisma } from "../../utils/prisma";
import { storageService } from "../storage/storage.service";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.types";
import {
	createErrorResponse,
	NotFoundError,
	ValidationError,
} from "../../utils/errors";
import { error } from "node:console";

export class CategoryService {
	private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

	async getAll() {
		const categories = prisma.category.findMany({
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
		return (await categories).map((cat) => ({
			...cat,
			imageUrl: cat.imageKey ? storageService.getPublicUrl(cat.imageKey) : null,
		}));
	}

	async getById(id: string) {
		const cat = await prisma.category.findUnique({ where: { id } });
		if (!cat) throw new NotFoundError("Category");
		return cat;
	}

	async create(data: CreateCategoryInput) {
		const total = await prisma.category.count();

		const order = data.order ?? total + 1;
		const title = data.title;

		// Validate order against actual count
		if (order < 1 || order > total + 1) {
			throw new ValidationError(`Order must be between 1 and ${total + 1}`);
		}

		// shift existing items if necessary
		if (order <= total) {
			await prisma.category.updateMany({
				where: { order: { gte: order } },
				data: { order: { increment: 1 } },
			});
		}

		return prisma.category.create({
			data: {
				title,
				order,
			},
		});
	}

	async update(id: string, data: UpdateCategoryInput) {
		const category = await this.getById(id);

		// if ordering changes, adjust neighbors
		if (data.order && data.order !== category.order) {
			const oldOrder = category.order;
			const newOrder = data.order;

			const maxOrder = await prisma.category.count();
			if (newOrder < 1 || newOrder > maxOrder) {
				throw new ValidationError(`Order must be between 1 and ${maxOrder}`);
			}

			await prisma.$transaction(async (tx) => {
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

				await tx.category.update({
					where: { id },
					data: {
						title: data.title ?? undefined,
						order: newOrder,
					},
				});
			});
		} else {
			// only updating title
			await prisma.category.update({
				where: { id },
				data: {
					title: data.title ?? undefined,
				},
			});
		}

		return this.getById(id);
	}

	async delete(id: string) {
		const category = await this.getById(id);

		// Check if category has subcategories
		const subCategoryCount = await prisma.subCategory.count({
			where: { categoryId: id },
		});

		if (subCategoryCount > 0) {
			throw new ValidationError(
				"Cannot delete category with existing subcategories"
			);
		}

		// Delete image if exists
		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
		}

		await prisma.$transaction(async (tx) => {
			await tx.category.delete({ where: { id } });

			// shift down remaining items
			await tx.category.updateMany({
				where: { order: { gt: category.order } },
				data: { order: { decrement: 1 } },
			});
		});

		return { success: true };
	}

	async deleteImage(id: string) {
		const category = await this.getById(id);

		if (category.imageKey) {
			await storageService.deleteObject(category.imageKey);
			await prisma.category.update({
				where: { id },
				data: { imageKey: null },
			});
		}

		return { success: true };
	}

	async reorder(items: { id: string; order: number }[]) {
		const existing = await prisma.category.findMany({ select: { id: true } });

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
				await tx.category.update({
					where: { id: item.id },
					data: { order: item.order },
				});
			}
		});

		return prisma.category.findMany({ orderBy: { order: "asc" } });
	}

	async getCategoryImageUploadUrl(categoryId: string) {
		const key = storageService.generateCategoryImageKey(
			categoryId,
			crypto.randomUUID() + ".webp"
		);

		// 3. Issue upload URL
		const uploadUrl = await storageService.getUploadUrl(key, "image/webp", 120);

		// 4. Save key in prisma (Prisma)
		await prisma.category.update({
			where: { id: categoryId },
			data: { imageKey: key },
		});

		return { uploadUrl };
	}

	// Enhanced uploadImages with validation and error handling
	async uploadImage(categoryId: string, image: File) {
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
		});

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

		// 4. Save key in prisma (Prisma)
		await prisma.category.update({
			where: { id: categoryId },
			data: { imageKey: key },
		});

		return {
			success: true,
			message: `${image} image uploaded successfully`,
		};
	}
}

export const categoryService = new CategoryService();
