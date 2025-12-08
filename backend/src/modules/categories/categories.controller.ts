// src/modules/category/category.controller.ts
import {
	CreateCategoryDto,
	UpdateCategoryDto,
	ReorderCategoriesDto,
} from "./categories.dto";
import { categoryService } from "./categories.service";

export class CategoryController {
	async getAll(ctx: any) {
		return await categoryService.getAll();
	}

	async getById(ctx: any) {
		return await categoryService.getById(ctx.params.id);
	}

	async create(ctx: any) {
		let data: any = {};
		try {
			const body = await ctx.request.json();
			const parsed = CreateCategoryDto.safeParse(body);
			if (!parsed.success) {
				ctx.set.status = 400;
				return parsed.error;
			}
			data = parsed.data;
		} catch (error) {
			// If no body or invalid JSON, create with defaults
			data = {};
		}

		return await categoryService.create(data);
	}

	async update(ctx: any) {
		const parsed = UpdateCategoryDto.safeParse(await ctx.request.json());
		if (!parsed.success) {
			ctx.set.status = 400;
			return parsed.error;
		}

		return await categoryService.update(ctx.params.id, parsed.data);
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
}

export const categoryController = new CategoryController();
