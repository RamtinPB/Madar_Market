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

export class ProductController {
	async getAllBySubCategory(ctx: any) {
		const { subCategoryId } = ctx.params;
		return await productService.getAllBySubCategory(subCategoryId);
	}

	async getById(ctx: any) {
		return await productService.getById(ctx.params.id);
	}

	async create(ctx: any) {
		const validatedData: CreateProductInput = ctx.validatedData;
		if (!validatedData) {
			ctx.set.status = 400;
			return { error: "Validation failed" };
		}

		return await productService.create(validatedData);
	}

	async update(ctx: any) {
		const validatedData: UpdateProductInput = ctx.validatedData;
		if (!validatedData) {
			ctx.set.status = 400;
			return { error: "Validation failed" };
		}

		return await productService.update(ctx.params.id, validatedData);
	}

	async delete(ctx: any) {
		return await productService.delete(ctx.params.id);
	}

	async reorder(ctx: any) {
		const { subCategoryId } = ctx.params;
		const parsed = ReorderProductsDto.safeParse(await ctx.body);
		if (!parsed.success) {
			ctx.set.status = 400;
			return parsed.error;
		}

		return await productService.reorder(subCategoryId, parsed.data.items);
	}

	async uploadImages(ctx: any) {
		const body = ctx.body || {};
		const images = Array.isArray(body.images) ? body.images : [body.images];
		if (!images || images.length === 0) {
			ctx.set.status = 400;
			return { error: "Images are required" };
		}
		return await productService.uploadImages(ctx.params.id, images);
	}

	async deleteImage(ctx: any) {
		return await productService.deleteImage(ctx.params.id, ctx.params.imageId);
	}

	async reorderImages(ctx: any) {
		const parsed = ReorderProductImagesDto.safeParse(await ctx.body);
		if (!parsed.success) {
			ctx.set.status = 400;
			return parsed.error;
		}

		return await productService.reorderImages(ctx.params.id, parsed.data.items);
	}
}

export const productController = new ProductController();
