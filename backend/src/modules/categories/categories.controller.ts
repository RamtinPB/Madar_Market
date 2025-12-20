// src/modules/category/category.controller.ts
import { ReorderCategoriesSchema } from "./categories.schema";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "./categories.schema";
import { categoryService } from "./categories.service";
import { createErrorResponse } from "../../shared/errors/http-errors";

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
		const parsed = ReorderCategoriesSchema.safeParse(await ctx.request.json());
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
		try {
			const body = ctx.body || {};
			const image = body.image;

			if (!image || image.length === 0) {
				return createErrorResponse(new Error("image are required"), 400);
			}

			const result = await categoryService.uploadImage(ctx.params.id, image);
			return result;
		} catch (error) {
			return createErrorResponse(error);
		}
	}

	async getCategoryImageUploadUrl(ctx: any) {
		return await categoryService.getCategoryImageUploadUrl(ctx.params.id);
	}
}

export const categoryController = new CategoryController();
