import { z } from "zod";

// File validation schema
const imageFileSchema = z
	.instanceof(File)
	.refine((file) => file.size <= 5 * 1024 * 1024, "File size must be <= 5MB")
	.refine(
		(file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
		"File must be PNG, JPEG, or WebP"
	);

// Response Schema
export const CategoryResponseSchema = z.object({
	id: z.number(),
	title: z.string(),
	imageKey: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export const CreateCategorySchema = z.object({
	title: z.string().min(0).optional(),
	imagePath: z.object(imageFileSchema).optional(),
});

export const UpdateCategorySchema = z.object({
	title: z.string().min(0).optional(),
	imagePath: z.object(imageFileSchema).optional(),
});

export const ReorderCategoriesSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
