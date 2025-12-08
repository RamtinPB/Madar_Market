// src/modules/category/category.dto.ts
import { z } from "zod";

export const CreateCategoryDto = z.object({
	title: z.string().min(2).optional(),
	imagePath: z.string().optional(),
	order: z.number().int().min(1).optional(),
});

export const UpdateCategoryDto = z.object({
	title: z.string().min(2).optional(),
	imagePath: z.string().optional(),
	order: z.number().int().min(1).optional(),
});

export const ReorderCategoriesDto = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});
