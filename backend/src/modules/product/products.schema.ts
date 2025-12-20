// src/modules/product/products.Schema.ts
import { z } from "zod";

// Schema for attributes
const attributeSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
});

// File validation schema for images
const imageFileSchema = z
	.instanceof(File)
	.refine((file) => file.size <= 5 * 1024 * 1024, "File size must be <= 5MB")
	.refine(
		(file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type),
		"File must be PNG, JPEG, or WebP"
	);

export const CreateProductSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	description: z.string().optional(),
	price: z.number().positive("Price must be positive").optional(),
	discountPercent: z.number().int().min(0).max(100).optional(),
	discountedPrice: z.number().positive().optional(),
	sponsorPrice: z.number().positive().optional(),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
	subCategoryId: z.string().min(1, "SubCategory ID is required"),
	attributes: z.array(attributeSchema).optional(),
	images: z.array(imageFileSchema).optional(), // Multiple images
});

export const UpdateProductSchema = z.object({
	title: z.string().min(1, "Title is required").optional(),
	description: z.string().optional(),
	price: z.number().positive("Price must be positive").optional(),
	discountPercent: z.number().int().min(0).max(100).optional(),
	discountedPrice: z.number().positive().optional(),
	sponsorPrice: z.number().positive().optional(),
	order: z.number().int().min(0, "Order must be >= 0").optional(),
	subCategoryId: z.string().min(1, "SubCategory ID is required").optional(),
	attributes: z.array(attributeSchema).optional(),
});

export const ReorderProductsSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});

export const ReorderProductImagesSchema = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});

export const UploadProductImagesSchema = z.object({
	images: z.array(imageFileSchema).min(1, "At least one image required"),
});

// Response Schema
export const ProductResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	price: z.string(), // Decimal as string
	discountPercent: z.number(),
	discountedPrice: z.string().nullable(),
	sponsorPrice: z.string().nullable(),
	order: z.number(),
	subCategoryId: z.string(),
	attributes: z.array(
		z.object({
			id: z.string(),
			title: z.string().nullable(),
			description: z.string().nullable(),
			order: z.number(),
		})
	),
	images: z.array(
		z.object({
			id: z.string(),
			path: z.string(),
			order: z.number(),
		})
	),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Type exports
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type UploadProductImagesInput = z.infer<
	typeof UploadProductImagesSchema
>;
export type ReorderProductImagesInput = z.infer<
	typeof ReorderProductImagesSchema
>;
