// src/modules/subCategories/subCategories.dto.ts
import { z } from "zod";

export const CreateSubCategoryDto = z.object({
	title: z.string().min(2).optional(),
	categoryId: z.string().min(1, "Category ID is required"),
	order: z.number().int().min(1).optional(),
});

export const UpdateSubCategoryDto = z.object({
	title: z.string().min(2).optional(),
	categoryId: z.string().min(1, "Category ID is required").optional(),
	order: z.number().int().min(1).optional(),
});

export const ReorderSubCategoriesDto = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});
