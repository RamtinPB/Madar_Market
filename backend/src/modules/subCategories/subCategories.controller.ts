// src/modules/subCategories/subCategories.controller.ts
import {
	CreateSubCategoryDto,
	UpdateSubCategoryDto,
	ReorderSubCategoriesDto,
} from "./subCategories.dto";
import type {
	CreateSubCategoryInput,
	UpdateSubCategoryInput,
} from "./subCategories.types";
import { subCategoryService } from "./subCategories.service";

export class SubCategoryController {
	async getAllByCategory(ctx: any) {
		const { categoryId } = ctx.params;
		return await subCategoryService.getAllByCategory(categoryId);
	}

	async getById(ctx: any) {
		return await subCategoryService.getById(ctx.params.id);
	}

	async create(ctx: any) {
		const validatedData: CreateSubCategoryInput = ctx.validatedData;
		if (!validatedData) {
			ctx.set.status = 400;
			return { error: "Validation failed" };
		}

		return await subCategoryService.create(validatedData);
	}

	async update(ctx: any) {
		const validatedData: UpdateSubCategoryInput = ctx.validatedData;
		if (!validatedData) {
			ctx.set.status = 400;
			return { error: "Validation failed" };
		}

		return await subCategoryService.update(ctx.params.id, validatedData);
	}

	async delete(ctx: any) {
		return await subCategoryService.delete(ctx.params.id);
	}

	async reorder(ctx: any) {
		const { categoryId } = ctx.params;
		const parsed = ReorderSubCategoriesDto.safeParse(await ctx.request.json());
		if (!parsed.success) {
			ctx.set.status = 400;
			return parsed.error;
		}

		return await subCategoryService.reorder(categoryId, parsed.data.items);
	}
}

export const subCategoryController = new SubCategoryController();
