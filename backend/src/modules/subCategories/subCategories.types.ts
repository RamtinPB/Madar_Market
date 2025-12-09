import { z } from "zod";

// Base schema for subcategory fields
const subCategoryFields = z.object({
	title: z.string().min(1, "Title is required"),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
	categoryId: z.string().min(1, "Category ID is required"),
});

// DTO for POST /subcategories
export const CreateSubCategoryDto = z.object({
	title: z.string().optional(),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
	categoryId: z.string().min(1, "Category ID is required"),
});

// DTO for PUT /subcategories/:id (metadata only)
export const UpdateSubCategoryDto = z.object({
	title: z.string().min(1, "Title is required").optional(),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
	categoryId: z.string().min(1, "Category ID is required").optional(),
});

// Response DTO
export const SubCategoryResponseDto = z.object({
	id: z.string(),
	title: z.string(),
	order: z.number(),
	categoryId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Type exports
export type CreateSubCategoryInput = z.infer<typeof CreateSubCategoryDto>;
export type UpdateSubCategoryInput = z.infer<typeof UpdateSubCategoryDto>;
export type SubCategoryResponse = z.infer<typeof SubCategoryResponseDto>;
