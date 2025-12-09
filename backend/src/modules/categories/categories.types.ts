import { z } from "zod";

// Base schema for category fields
const categoryFields = z.object({
	title: z.string().min(1, "Title is required"),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
});

// File validation schema
const imageFileSchema = z
	.instanceof(File)
	.refine((file) => file.size <= 5 * 1024 * 1024, "File size must be <= 5MB")
	.refine(
		(file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
		"File must be PNG, JPEG, or WebP"
	);

// DTO for POST /categories
export const CreateCategoryDto = z.object({
	title: z.string().optional(),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
	image: imageFileSchema.optional(), // Required for POST
});

// DTO for PUT /categories/:id (metadata only)
export const UpdateCategoryDto = z.object({
	title: z.string().min(1, "Title is required").optional(),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
});

// Response DTO
export const CategoryResponseDto = z.object({
	id: z.string(),
	title: z.string(),
	order: z.number(),
	imagePath: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof CreateCategoryDto>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryDto>;
export type CategoryResponse = z.infer<typeof CategoryResponseDto>;
