import { z } from "zod";

// Schema for POST /subcategories
export const CreateSubCategorySchema = z.object({
	title: z.string().optional(),
	categoryId: z.string().min(1, "Category ID is required"),
});

// Schema for PUT /subcategories/:id (metadata only)
export const UpdateSubCategorySchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	categoryId: z.string().min(1, "Category ID is required").optional(),
});

// Response Schema
export const SubCategoryResponseSchema = z.object({
	businessId: z.string(),
	order: z.number(),
	title: z.string(),
	categoryId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ReorderSubCategoriesSchema = z.object({
	items: z.array(
		z.object({
			businessId: z.string(),
			order: z.number().int().min(1),
		})
	),
});

// Type exports
export type CreateSubCategoryInput = z.infer<typeof CreateSubCategorySchema>;
export type UpdateSubCategoryInput = z.infer<typeof UpdateSubCategorySchema>;
export type SubCategoryResponse = z.infer<typeof SubCategoryResponseSchema>;
