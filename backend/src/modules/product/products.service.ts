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

	async getById(businessId: string) {
		const product = await productRepository.findProductById(businessId);
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
		const title = data.title ?? "New Product";
		const price = data.price ?? 0;
		const discountPercent = data.discountPercent ?? 0;

		const product = await productRepository.createProduct({
			...data,
			title,
			price,
			discountPercent,
		});

		// Create attributes if provided
		if (data.attributes && data.attributes.length > 0) {
			await productRepository.createAttributes(
				product.businessId,
				data.attributes
			);
			// Re-fetch to include attributes
			return this.getById(product.businessId);
		}

		return product;
	}

	async update(businessId: string, data: UpdateProductInput) {
		const product = await this.getById(businessId);

		// if subCategoryId changes, update both subcategories
		if (data.subCategoryId && data.subCategoryId !== product.subCategoryId) {
			// Check new subCategory exists
			const newSubCategory = await productRepository.findSubCatById(
				data.subCategoryId
			);
			if (!newSubCategory) throw new NotFoundError("SubCategory not found");

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
			};

			await productRepository.updateProduct(businessId, updateData);
		} else {
			// Same subcategory, handle regular updates
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

			await productRepository.updateProduct(businessId, updateData);
		}

		// Handle attributes update
		if (data.attributes !== undefined) {
			// Delete existing attributes
			await productRepository.deleteAttributes(businessId);

			// Create new attributes
			if (data.attributes.length > 0) {
				await productRepository.createAttributes(businessId, data.attributes);
			}
		}

		return this.getById(businessId);
	}

	async delete(businessId: string) {
		const product = await this.getById(businessId);

		// Delete all images
		for (const image of product.images) {
			if (image.key) {
				await storageService.deleteObject(image.key);
			}
		}

		await productRepository.deleteProductWithTransaction(
			businessId,
			async (tx) => {
				// Image deletion handled above, no need in transaction
			}
		);

		return { success: true, message: "Product deleted successfully" };
	}

	async reorder(
		subCategoryId: string,
		items: { businessId: string; order: number }[]
	) {
		const existing = await productRepository.getProductsBySubCategoryForReorder(
			subCategoryId
		);

		if (existing.length !== items.length) {
			throw new BadRequestError("Mismatched item count");
		}

		const existingIds = new Set(existing.map((x) => x.businessId));
		const providedIds = new Set(items.map((x) => x.businessId));

		if (existingIds.size !== providedIds.size) {
			throw new BadRequestError("Invalid product IDs");
		}

		// Since we're using businessId-based ordering, we don't need to actually reorder anything
		// The frontend can sort by businessId when displaying
		// Just validate that the provided IDs are valid
		const businessIdItems = items.map((item) => ({
			businessId: item.businessId,
			order: item.order,
		}));

		await productRepository.reorderProductsTransaction(
			businessIdItems,
			async (tx) => {
				// Validation completed above, no additional transaction work needed
			}
		);

		return productRepository.getProductsBySubCategoryWithIncludes(
			subCategoryId
		);
	}

	// Enhanced uploadImages with validation and error handling
	async uploadImages(businessId: string, images: File[]) {
		const product = await this.getById(businessId);

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
			if (image.key) {
				await storageService.deleteObject(image.key);
			}
		}
		await productRepository.deleteAllProductImages(businessId);

		const newImages: { key: string }[] = [];
		for (let i = 0; i < images.length; i++) {
			const filename = `${crypto.randomUUID()}.webp`;
			const key = storageService.generateProductImageKey(businessId, filename);
			await storageService.uploadFile(key, images[i] as File, "image/webp");
			newImages.push({ key });
		}

		await productRepository.createProductImages(businessId, newImages);

		const updatedProduct = await this.getById(businessId);
		return {
			success: true,
			message: `${images.length} images uploaded successfully`,
			data: updatedProduct,
		};
	}

	// Enhanced deleteImage by ID with better error handling
	async deleteImage(productId: string, imageId: string) {
		const image = await productRepository.findProductImageById(imageId);
		if (!image || image.productId !== productId || !image.key) {
			throw new NotFoundError("Image not found");
		}

		await storageService.deleteObject(image.key);
		await productRepository.deleteProductImage(imageId);

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

		return this.deleteImage(productId, image.businessId);
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

		return this.deleteImage(productId, image.businessId);
	}

	async reorderImages(
		productId: string,
		items: { businessId: string; order: number }[]
	) {
		const existing = await productRepository.findProductImagesByProduct(
			productId
		);

		if (existing.length !== items.length) {
			throw new BadRequestError("Mismatched item count");
		}

		const existingIds = new Set(existing.map((x) => x.businessId));
		const providedIds = new Set(items.map((x) => x.businessId));

		if (existingIds.size !== providedIds.size) {
			throw new BadRequestError("Invalid image IDs");
		}

		// Since we're using businessId-based ordering, we don't need to actually reorder anything
		// The frontend can sort by businessId when displaying
		// Just validate that the provided IDs are valid
		const businessIdItems = items.map((item) => ({
			businessId: item.businessId,
			order: item.order,
		}));

		await productRepository.reorderProductImagesTransaction(
			businessIdItems,
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
