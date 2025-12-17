// src/modules/product/products.service.ts
import { prisma } from "../../utils/prisma";
import { storageService } from "../storage/storage.service";
import {
	ValidationError,
	NotFoundError,
	BadRequestError,
} from "../../utils/errors";
import type {
	CreateProductInput,
	UpdateProductInput,
	UploadProductImagesInput,
	ReorderProductImagesInput,
} from "./products.types";

export class ProductService {
	private readonly MAX_IMAGES_PER_PRODUCT = 10;
	private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
		if (!product) throw new NotFoundError("Product not found");
		return product;
	}

	async create(data: CreateProductInput) {
		// Check if subCategory exists
		const subCategory = await prisma.subCategory.findUnique({
			where: { id: data.subCategoryId },
		});
		if (!subCategory) throw new NotFoundError("SubCategory not found");

		const total = await prisma.product.count({
			where: { subCategoryId: data.subCategoryId },
		});

		const order = data.order ?? total + 1;
		const title = data.title ?? "New Product";
		const price = data.price ?? 0;
		const discountPercent = data.discountPercent ?? 0;

		if (order > total + 1) {
			throw new BadRequestError("Invalid order position");
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
			if (!newSubCategory) throw new NotFoundError("SubCategory not found");

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
					throw new BadRequestError("Invalid order position");
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
			await storageService.deleteObject(image.key);
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

		return { success: true, message: "Product deleted successfully" };
	}

	async reorder(subCategoryId: string, items: { id: string; order: number }[]) {
		const existing = await prisma.product.findMany({
			where: { subCategoryId },
			select: { id: true },
		});

		if (existing.length !== items.length) {
			throw new BadRequestError("Mismatched item count");
		}

		const existingIds = new Set(existing.map((x) => x.id));
		const providedIds = new Set(items.map((x) => x.id));

		if (existingIds.size !== providedIds.size) {
			throw new BadRequestError("Invalid product IDs");
		}

		const orders = items.map((x) => x.order);
		const uniqueOrders = new Set(orders);

		if (uniqueOrders.size !== orders.length) {
			throw new BadRequestError("Duplicate order values");
		}

		const max = existing.length;
		for (const o of orders) {
			if (o < 1 || o > max) throw new BadRequestError("Order out of range");
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

	// Enhanced uploadImages with validation and error handling
	async uploadImages(id: string, images: File[]) {
		const product = await this.getById(id);

		// Validate image count
		if (images.length === 0) {
			throw new BadRequestError("At least one image is required");
		}

		if (images.length > this.MAX_IMAGES_PER_PRODUCT) {
			throw new BadRequestError(
				`Maximum ${this.MAX_IMAGES_PER_PRODUCT} images allowed per product`
			);
		}

		// Validate each image
		for (const image of images) {
			if (image.size > this.MAX_FILE_SIZE) {
				throw new ValidationError(
					`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`
				);
			}

			if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
				throw new ValidationError(
					"Only JPEG, PNG, and WebP images are allowed"
				);
			}
		}

		// Delete existing images (bulk deletion for replacement workflow)
		for (const image of product.images) {
			await storageService.deleteObject(image.key);
		}
		await prisma.productImage.deleteMany({
			where: { productId: id },
		});

		const newImages: { key: string; order: number }[] = [];
		for (let i = 0; i < images.length; i++) {
			const filename = `${crypto.randomUUID()}.webp`;
			const key = storageService.generateProductImageKey(id, filename);
			await storageService.uploadFile(key, images[i] as File, "image/webp");
			newImages.push({ key, order: i + 1 });
		}

		await prisma.productImage.createMany({
			data: newImages.map((img) => ({
				productId: id,
				key: img.key,
				order: img.order,
			})),
		});

		const updatedProduct = await this.getById(id);
		return {
			success: true,
			message: `${images.length} images uploaded successfully`,
			data: updatedProduct,
		};
	}

	// Enhanced deleteImage by ID with better error handling
	async deleteImage(productId: string, imageId: string) {
		const image = await prisma.productImage.findUnique({
			where: { id: imageId },
		});
		if (!image || image.productId !== productId) {
			throw new NotFoundError("Image not found");
		}

		await storageService.deleteObject(image.key);
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

		const updatedProduct = await this.getById(productId);
		return {
			success: true,
			message: "Image deleted successfully",
			data: updatedProduct,
		};
	}

	// New method: Delete image by filename
	async deleteImageByFilename(productId: string, filename: string) {
		const image = await prisma.productImage.findFirst({
			where: {
				productId,
				key: {
					contains: `/${productId}/${filename}`,
				},
			},
		});

		if (!image) {
			throw new NotFoundError("Image not found");
		}

		return this.deleteImage(productId, image.id);
	}

	// New method: Delete image by URL parameter (filename without UUID prefix)
	async deleteImageByUrlParameter(productId: string, urlParam: string) {
		// Extract filename from URL parameter (remove .webp extension if present)
		const cleanFilename = urlParam.replace(/\.webp$/, "") + ".webp";

		const image = await prisma.productImage.findFirst({
			where: {
				productId,
				key: {
					contains: `/${productId}/${cleanFilename}`,
				},
			},
		});

		if (!image) {
			throw new NotFoundError("Image not found");
		}

		return this.deleteImage(productId, image.id);
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
			throw new BadRequestError("Mismatched item count");
		}

		const existingIds = new Set(existing.map((x) => x.id));
		const providedIds = new Set(items.map((x) => x.id));

		if (existingIds.size !== providedIds.size) {
			throw new BadRequestError("Invalid image IDs");
		}

		const orders = items.map((x) => x.order);
		const uniqueOrders = new Set(orders);

		if (uniqueOrders.size !== orders.length) {
			throw new BadRequestError("Duplicate order values");
		}

		const max = existing.length;
		for (const o of orders) {
			if (o < 1 || o > max) throw new BadRequestError("Order out of range");
		}

		await prisma.$transaction(async (tx) => {
			for (const item of items) {
				await tx.productImage.update({
					where: { id: item.id },
					data: { order: item.order },
				});
			}
		});

		const updatedProduct = await this.getById(productId);
		return {
			success: true,
			message: "Images reordered successfully",
			data: updatedProduct,
		};
	}
}

export const productService = new ProductService();
