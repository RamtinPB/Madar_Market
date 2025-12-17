// src/modules/product/products.controller.ts
import {
	CreateProductDto,
	UpdateProductDto,
	ReorderProductsDto,
	UploadProductImagesDto,
	ReorderProductImagesDto,
} from "./products.dto";
import type {
	CreateProductInput,
	UpdateProductInput,
	UploadProductImagesInput,
	ReorderProductImagesInput,
} from "./products.types";
import { productService } from "./products.service";
import { storageService } from "../storage/storage.service";
import { createErrorResponse } from "../../utils/errors";

export class ProductController {
	async getAllBySubCategory(ctx: any) {
		try {
			const { subCategoryId } = ctx.params;
			const products = await productService.getAllBySubCategory(subCategoryId);
			return { success: true, data: products };
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async getById(ctx: any) {
		try {
			const product = await productService.getById(ctx.params.id);
			return { success: true, data: product };
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async create(ctx: any) {
		try {
			const validatedData: CreateProductInput = ctx.validatedData;
			if (!validatedData) {
				return createErrorResponse(new Error("Validation failed"), 400);
			}

			const product = await productService.create(validatedData);
			return {
				success: true,
				data: product,
				message: "Product created successfully",
			};
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async update(ctx: any) {
		try {
			const validatedData: UpdateProductInput = ctx.validatedData;
			if (!validatedData) {
				return createErrorResponse(new Error("Validation failed"), 400);
			}

			const product = await productService.update(ctx.params.id, validatedData);
			return {
				success: true,
				data: product,
				message: "Product updated successfully",
			};
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async delete(ctx: any) {
		try {
			const result = await productService.delete(ctx.params.id);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async reorder(ctx: any) {
		try {
			const { subCategoryId } = ctx.params;
			const parsed = ReorderProductsDto.safeParse(await ctx.body);
			if (!parsed.success) {
				return createErrorResponse(parsed.error, 400);
			}

			const products = await productService.reorder(
				subCategoryId,
				parsed.data.items
			);
			return {
				success: true,
				data: products,
				message: "Products reordered successfully",
			};
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async uploadImages(ctx: any) {
		try {
			const body = ctx.body || {};
			const images = Array.isArray(body.images) ? body.images : [body.images];

			if (!images || images.length === 0) {
				return createErrorResponse(new Error("Images are required"), 400);
			}

			const result = await productService.uploadImages(ctx.params.id, images);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	// Enhanced deleteImage by ID with better error handling
	async deleteImage(ctx: any) {
		try {
			const result = await productService.deleteImage(
				ctx.params.id,
				ctx.params.imageId
			);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	// New controller method: Delete image by filename
	async deleteImageByFilename(ctx: any) {
		try {
			const { productId } = ctx.params;
			const { filename } = ctx.query;

			if (!filename) {
				return createErrorResponse(new Error("Filename is required"), 400);
			}

			const result = await productService.deleteImageByFilename(
				productId,
				filename
			);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	// New controller method: Delete image by URL parameter
	async deleteImageByUrlParameter(ctx: any) {
		try {
			const { productId } = ctx.params;
			const { url } = ctx.query;

			if (!url) {
				return createErrorResponse(new Error("URL parameter is required"), 400);
			}

			const result = await productService.deleteImageByUrlParameter(
				productId,
				url
			);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async reorderImages(ctx: any) {
		try {
			const parsed = ReorderProductImagesDto.safeParse(await ctx.body);
			if (!parsed.success) {
				return createErrorResponse(parsed.error, 400);
			}

			const result = await productService.reorderImages(
				ctx.params.id,
				parsed.data.items
			);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async getProductImageUploadUrl(ctx: any) {
		try {
			const productId = ctx.params.id;

			// Generate key
			const key = storageService.generateProductImageKey(
				productId,
				crypto.randomUUID() + ".webp"
			);

			// Issue upload URL
			const uploadUrl = await storageService.getUploadUrl(
				key,
				"image/webp",
				120
			);

			// Save key in DB
			await ctx.db.productImage.create({
				data: {
					productId,
					key,
					order: 999, // temporary, will be reordered later
				},
			});

			return {
				success: true,
				data: { uploadUrl, key },
				message: "Upload URL generated successfully",
			};
		} catch (error) {
			return createErrorResponse(error);
		}
	}
}

export const productController = new ProductController();
