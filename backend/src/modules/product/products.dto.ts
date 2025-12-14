// src/modules/product/products.dto.ts
import { z } from "zod";

const attributeSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
});

export const CreateProductDto = z.object({
	title: z.string().min(2).optional(),
	description: z.string().optional(),
	price: z.number().positive().optional(),
	discountPercent: z.number().int().min(0).max(100).optional(),
	discountedPrice: z.number().positive().optional(),
	sponsorPrice: z.number().positive().optional(),
	order: z.number().int().min(1).optional(),
	subCategoryId: z.string().min(1, "SubCategory ID is required"),
	attributes: z.array(attributeSchema).optional(),
	images: z.array(z.instanceof(File)).optional(),
});

export const UpdateProductDto = z.object({
	title: z.string().min(2).optional(),
	description: z.string().optional(),
	price: z.number().positive().optional(),
	discountPercent: z.number().int().min(0).max(100).optional(),
	discountedPrice: z.number().positive().optional(),
	sponsorPrice: z.number().positive().optional(),
	order: z.number().int().min(1).optional(),
	subCategoryId: z.string().min(1, "SubCategory ID is required").optional(),
	attributes: z.array(attributeSchema).optional(),
});

export const ReorderProductsDto = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});

export const UploadProductImagesDto = z.object({
	images: z.array(z.instanceof(File)).min(1, "At least one image required"),
});

export const ReorderProductImagesDto = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			order: z.number().int().min(1),
		})
	),
});
