// src/modules/product/products.service.ts
import { storageService } from "../../infrastructure/storage/s3.storage";
import {
	ValidationError,
	NotFoundError,
	BadRequestError,
} from "../../shared/errors/http-errors";
import { productRepository } from "./products.repository";
import type { CreateProductInput, UpdateProductInput } from "./products.schema";

export class ProductService {
	private readonly MAX_IMAGES_PER_PRODUCT = 10;
	private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

	async getAllBySubCategory(subCategoryId: string) {
		return await productRepository.getSubCatProducts(subCategoryId);
	}

	async getById(id: string) {
		const product = await productRepository.findProductById(id);
		if (!product) throw new NotFoundError("Product not found");
		return product;
	}

	async create(data: CreateProductInput) {
		// Check if subCategory exists
		const subCategory = await productRepository.findSubCatById(
			data.subCategoryId
		);
		if (!subCategory) throw new NotFoundError("SubCategory not found");

		const total = await productRepository.getProductCountBySubCategory(
			data.subCategoryId
		);
		const order = data.order ?? total + 1;
		const title = data.title ?? "New Product";
		const price = data.price ?? 0;
		const discountPercent = data.discountPercent ?? 0;

		if (order > total + 1) {
			throw new BadRequestError("Invalid order position");
		}

		// shift existing items if necessary
		if (order <= total) {
			await productRepository.updateProductsOrder(
				data.subCategoryId,
				order,
				true
			);
		}

		// No images in create

		const product = await productRepository.createProduct({
			...data,
			order,
			title,
			price,
			discountPercent,
		});

		// Create attributes if provided
		if (data.attributes && data.attributes.length > 0) {
			await productRepository.createAttributes(product.id, data.attributes);
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
			const newSubCategory = await productRepository.findSubCatById(
				data.subCategoryId
			);
			if (!newSubCategory) throw new NotFoundError("SubCategory not found");

			// Remove from old subcategory order
			await productRepository.updateProductsOrder(
				product.subCategoryId,
				product.order,
				false
			);

			// Add to new subcategory
			const newTotal = await productRepository.getProductCountBySubCategory(
				data.subCategoryId
			);
			const newOrder = data.order ?? newTotal + 1;

			const updateData = {
				...(data.title !== undefined && { title: data.title }),
				...(data.description !== undefined && {
					description: data.description,
				}),
				...(data.price !== undefined && { price: data.price }),
				...(data.discountPercent !== undefined && {
					discountPercent: data.discountPercent,
				}),
				...(data.discountedPrice !== undefined && {
					discountedPrice: data.discountedPrice,
				}),
				...(data.sponsorPrice !== undefined && {
					sponsorPrice: data.sponsorPrice,
				}),
				subCategoryId: data.subCategoryId,
				order: newOrder,
			};

			await productRepository.updateProduct(id, updateData);
		} else {
			// Same subcategory, handle order change
			if (data.order && data.order !== product.order) {
				const oldOrder = product.order;
				const newOrder = data.order;

				const maxOrder = await productRepository.getProductCountBySubCategory(
					product.subCategoryId
				);
				if (newOrder < 1 || newOrder > maxOrder) {
					throw new BadRequestError("Invalid order position");
				}

				const updateData = {
					...(data.title !== undefined && { title: data.title }),
					...(data.description !== undefined && {
						description: data.description,
					}),
					...(data.price !== undefined && { price: data.price }),
					...(data.discountPercent !== undefined && {
						discountPercent: data.discountPercent,
					}),
					...(data.discountedPrice !== undefined && {
						discountedPrice: data.discountedPrice,
					}),
					...(data.sponsorPrice !== undefined && {
						sponsorPrice: data.sponsorPrice,
					}),
					order: newOrder,
				};

				await productRepository.updateProductWithTransaction(
					id,
					updateData,
					async (tx) => {
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
					}
				);
			} else {
				// only updating other fields
				const updateData = {
					...(data.title !== undefined && { title: data.title }),
					...(data.description !== undefined && {
						description: data.description,
					}),
					...(data.price !== undefined && { price: data.price }),
					...(data.discountPercent !== undefined && {
						discountPercent: data.discountPercent,
					}),
					...(data.discountedPrice !== undefined && {
						discountedPrice: data.discountedPrice,
					}),
					...(data.sponsorPrice !== undefined && {
						sponsorPrice: data.sponsorPrice,
					}),
				};

				await productRepository.updateProduct(id, updateData);
			}
		}

		// Handle attributes update
		if (data.attributes !== undefined) {
			// Delete existing attributes
			await productRepository.deleteAttributes(id);

			// Create new attributes
			if (data.attributes.length > 0) {
				await productRepository.createAttributes(id, data.attributes);
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

		await productRepository.deleteProductWithTransaction(
			id,
			{ subCategoryId: product.subCategoryId, order: product.order },
			async (tx) => {
				// Image deletion handled above, no need in transaction
			}
		);

		return { success: true, message: "Product deleted successfully" };
	}

	async reorder(subCategoryId: string, items: { id: string; order: number }[]) {
		const existing = await productRepository.getProductsBySubCategoryForReorder(
			subCategoryId
		);

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

		await productRepository.reorderProductsTransaction(items, async (tx) => {
			// Validation completed above, no additional transaction work needed
		});

		return productRepository.getProductsBySubCategoryWithIncludes(
			subCategoryId
		);
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
		await productRepository.deleteAllProductImages(id);

		const newImages: { key: string; order: number }[] = [];
		for (let i = 0; i < images.length; i++) {
			const filename = `${crypto.randomUUID()}.webp`;
			const key = storageService.generateProductImageKey(id, filename);
			await storageService.uploadFile(key, images[i] as File, "image/webp");
			newImages.push({ key, order: i + 1 });
		}

		await productRepository.createProductImages(id, newImages);

		const updatedProduct = await this.getById(id);
		return {
			success: true,
			message: `${images.length} images uploaded successfully`,
			data: updatedProduct,
		};
	}

	// Enhanced deleteImage by ID with better error handling
	async deleteImage(productId: string, imageId: string) {
		const image = await productRepository.findProductImageById(imageId);
		if (!image || image.productId !== productId) {
			throw new NotFoundError("Image not found");
		}

		await storageService.deleteObject(image.key);
		await productRepository.deleteProductImage(imageId);

		// Reorder remaining images
		const remainingImages = await productRepository.findProductImagesByProduct(
			productId
		);

		await productRepository.reorderProductImagesTransaction(
			remainingImages.map((img, index) => ({
				id: img.id,
				order: index + 1,
			})),
			async (tx) => {
				// No additional transaction work needed
			}
		);

		const updatedProduct = await this.getById(productId);
		return {
			success: true,
			message: "Image deleted successfully",
			data: updatedProduct,
		};
	}

	// New method: Delete image by filename
	async deleteImageByFilename(productId: string, filename: string) {
		const image = await productRepository.findProductImageByFilename(
			productId,
			filename
		);

		if (!image) {
			throw new NotFoundError("Image not found");
		}

		return this.deleteImage(productId, image.id);
	}

	// New method: Delete image by URL parameter (filename without UUID prefix)
	async deleteImageByUrlParameter(productId: string, urlParam: string) {
		// Extract filename from URL parameter (remove .webp extension if present)
		const cleanFilename = urlParam.replace(/\.webp$/, "") + ".webp";

		const image = await productRepository.findProductImageByFilename(
			productId,
			cleanFilename
		);

		if (!image) {
			throw new NotFoundError("Image not found");
		}

		return this.deleteImage(productId, image.id);
	}

	async reorderImages(
		productId: string,
		items: { id: string; order: number }[]
	) {
		const existing = await productRepository.findProductImagesByProduct(
			productId
		);

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

		await productRepository.reorderProductImagesTransaction(
			items,
			async (tx) => {
				// Validation completed above, no additional transaction work needed
			}
		);

		const updatedProduct = await this.getById(productId);
		return {
			success: true,
			message: "Images reordered successfully",
			data: updatedProduct,
		};
	}
}

export const productService = new ProductService();
