// src/modules/product/products.service.ts
import { prisma } from "../../utils/prisma";
import { saveUploadedFile, deleteFile } from "../../utils/files";
import type {
	CreateProductInput,
	UpdateProductInput,
	UploadProductImagesInput,
	ReorderProductImagesInput,
} from "./products.types";

export class ProductService {
	async getAllBySubCategory(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
	}

	async getById(id: string) {
		const product = await prisma.product.findUnique({
			where: { id },
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
		});
		if (!product) throw new Error("NOT_FOUND");
		return product;
	}

	async create(data: CreateProductInput) {
		// Check if subCategory exists
		const subCategory = await prisma.subCategory.findUnique({
			where: { id: data.subCategoryId },
		});
		if (!subCategory) throw new Error("SUBCATEGORY_NOT_FOUND");

		const total = await prisma.product.count({
			where: { subCategoryId: data.subCategoryId },
		});

		const order = data.order ?? total + 1;
		const title = data.title ?? "New Product";
		const price = data.price ?? 0;
		const discountPercent = data.discountPercent ?? 0;

		if (order > total + 1) {
			throw new Error("INVALID_ORDER");
		}

		// shift existing items if necessary
		if (order <= total) {
			await prisma.product.updateMany({
				where: {
					subCategoryId: data.subCategoryId,
					order: { gte: order },
				},
				data: { order: { increment: 1 } },
			});
		}

		// No images in create

		const product = await prisma.product.create({
			data: {
				title,
				description: data.description,
				price,
				discountPercent,
				discountedPrice: data.discountedPrice,
				sponsorPrice: data.sponsorPrice,
				subCategoryId: data.subCategoryId,
				order,
			},
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
		});

		// Create attributes if provided
		if (data.attributes && data.attributes.length > 0) {
			await prisma.attributes.createMany({
				data: data.attributes.map((attr, index) => ({
					productId: product.id,
					title: attr.title,
					description: attr.description,
					order: attr.order ?? index + 1,
				})),
			});
			// Re-fetch to include attributes
			return this.getById(product.id);
		}

		return product;
	}

	async update(id: string, data: UpdateProductInput) {
		const product = await this.getById(id);

		// if subCategoryId changes, need to handle order in both subcategories
		if (data.subCategoryId && data.subCategoryId !== product.subCategoryId) {
			// Check new subCategory exists
			const newSubCategory = await prisma.subCategory.findUnique({
				where: { id: data.subCategoryId },
			});
			if (!newSubCategory) throw new Error("SUBCATEGORY_NOT_FOUND");

			// Remove from old subcategory order
			await prisma.product.updateMany({
				where: {
					subCategoryId: product.subCategoryId,
					order: { gt: product.order },
				},
				data: { order: { decrement: 1 } },
			});

			// Add to new subcategory
			const newTotal = await prisma.product.count({
				where: { subCategoryId: data.subCategoryId },
			});
			const newOrder = data.order ?? newTotal + 1;

			await prisma.product.update({
				where: { id },
				data: {
					title: data.title,
					description: data.description,
					price: data.price,
					discountPercent: data.discountPercent,
					discountedPrice: data.discountedPrice,
					sponsorPrice: data.sponsorPrice,
					subCategoryId: data.subCategoryId,
					order: newOrder,
				},
			});
		} else {
			// Same subcategory, handle order change
			if (data.order && data.order !== product.order) {
				const oldOrder = product.order;
				const newOrder = data.order;

				const maxOrder = await prisma.product.count({
					where: { subCategoryId: product.subCategoryId },
				});
				if (newOrder < 1 || newOrder > maxOrder) {
					throw new Error("INVALID_ORDER");
				}

				await prisma.$transaction(async (tx) => {
					if (newOrder < oldOrder) {
						await tx.product.updateMany({
							where: {
								subCategoryId: product.subCategoryId,
								order: { gte: newOrder, lt: oldOrder },
							},
							data: { order: { increment: 1 } },
						});
					} else {
						await tx.product.updateMany({
							where: {
								subCategoryId: product.subCategoryId,
								order: { gt: oldOrder, lte: newOrder },
							},
							data: { order: { decrement: 1 } },
						});
					}

					await tx.product.update({
						where: { id },
						data: {
							title: data.title,
							description: data.description,
							price: data.price,
							discountPercent: data.discountPercent,
							discountedPrice: data.discountedPrice,
							sponsorPrice: data.sponsorPrice,
							order: newOrder,
						},
					});
				});
			} else {
				// only updating other fields
				await prisma.product.update({
					where: { id },
					data: {
						title: data.title,
						description: data.description,
						price: data.price,
						discountPercent: data.discountPercent,
						discountedPrice: data.discountedPrice,
						sponsorPrice: data.sponsorPrice,
					},
				});
			}
		}

		// Handle attributes update
		if (data.attributes !== undefined) {
			// Delete existing attributes
			await prisma.attributes.deleteMany({
				where: { productId: id },
			});

			// Create new attributes
			if (data.attributes.length > 0) {
				await prisma.attributes.createMany({
					data: data.attributes.map((attr, index) => ({
						productId: id,
						title: attr.title,
						description: attr.description,
						order: attr.order ?? index + 1,
					})),
				});
			}
		}

		return this.getById(id);
	}

	async delete(id: string) {
		const product = await this.getById(id);

		// Delete all images
		for (const image of product.images) {
			await deleteFile(image.path);
		}

		await prisma.$transaction(async (tx) => {
			// Delete attributes
			await tx.attributes.deleteMany({
				where: { productId: id },
			});

			await tx.product.delete({ where: { id } });

			// shift down remaining items in the same subcategory
			await tx.product.updateMany({
				where: {
					subCategoryId: product.subCategoryId,
					order: { gt: product.order },
				},
				data: { order: { decrement: 1 } },
			});
		});

		return { success: true };
	}

	async reorder(subCategoryId: string, items: { id: string; order: number }[]) {
		const existing = await prisma.product.findMany({
			where: { subCategoryId },
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
				await tx.product.update({
					where: { id: item.id },
					data: { order: item.order },
				});
			}
		});

		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
	}

	async uploadImages(id: string, images: File[]) {
		const product = await this.getById(id);

		// Delete existing images
		for (const image of product.images) {
			await deleteFile(image.path);
		}
		await prisma.productImage.deleteMany({
			where: { productId: id },
		});

		const targetFolder = `public/uploads/products/${id}`;

		const newImages: { path: string; order: number }[] = [];
		for (let i = 0; i < images.length; i++) {
			const imagePath = await saveUploadedFile(images[i] as File, targetFolder);
			newImages.push({ path: imagePath, order: i + 1 });
		}

		await prisma.productImage.createMany({
			data: newImages.map((img) => ({
				productId: id,
				path: img.path,
				order: img.order,
			})),
		});

		return this.getById(id);
	}

	async deleteImage(productId: string, imageId: string) {
		const image = await prisma.productImage.findUnique({
			where: { id: imageId },
		});
		if (!image || image.productId !== productId) {
			throw new Error("IMAGE_NOT_FOUND");
		}

		await deleteFile(image.path);

		await prisma.productImage.delete({ where: { id: imageId } });

		// Reorder remaining images
		const remainingImages = await prisma.productImage.findMany({
			where: { productId },
			orderBy: { order: "asc" },
		});

		await prisma.$transaction(async (tx) => {
			for (let i = 0; i < remainingImages.length; i++) {
				await tx.productImage.update({
					where: { id: remainingImages[i]!.id },
					data: { order: i + 1 },
				});
			}
		});

		return this.getById(productId);
	}

	async reorderImages(
		productId: string,
		items: { id: string; order: number }[]
	) {
		const existing = await prisma.productImage.findMany({
			where: { productId },
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
				await tx.productImage.update({
					where: { id: item.id },
					data: { order: item.order },
				});
			}
		});

		return this.getById(productId);
	}
}

export const productService = new ProductService();
