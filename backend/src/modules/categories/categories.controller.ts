// src/modules/category/category.controller.ts
import {
	CreateCategoryDto,
	UpdateCategoryDto,
	ReorderCategoriesDto,
} from "./categories.dto";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.types";
import { categoryService } from "./categories.service";

export class CategoryController {
	async getAll(ctx: any) {
		return await categoryService.getAll();
	}

	async getById(ctx: any) {
		return await categoryService.getById(ctx.params.id);
	}

	async create(ctx: any) {
		const validatedData: CreateCategoryInput = ctx.validatedData;
		if (!validatedData) {
			ctx.set.status = 400;
			return { error: "Validation failed" };
		}

		return await categoryService.create(validatedData);
	}

	async update(ctx: any) {
		const validatedData: UpdateCategoryInput = ctx.validatedData;
		if (!validatedData) {
			ctx.set.status = 400;
			return { error: "Validation failed" };
		}

		return await categoryService.update(ctx.params.id, validatedData);
	}

	async delete(ctx: any) {
		return await categoryService.delete(ctx.params.id);
	}

	async reorder(ctx: any) {
		const parsed = ReorderCategoriesDto.safeParse(await ctx.request.json());
		if (!parsed.success) {
			ctx.set.status = 400;
			return parsed.error;
		}

		return await categoryService.reorder(parsed.data.items);
	}

	async deleteImage(ctx: any) {
		return await categoryService.deleteImage(ctx.params.id);
	}

	async uploadImage(ctx: any) {
		const body = ctx.body || {};
		const image = body.image;
		if (!image) {
			ctx.set.status = 400;
			return { error: "Image file is required" };
		}
		return await categoryService.uploadImage(ctx.params.id, image);
	}
}

export const categoryController = new CategoryController();
