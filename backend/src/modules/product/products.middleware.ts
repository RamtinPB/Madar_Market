import { z } from "zod";
import { CreateProductDto, UpdateProductDto } from "./products.types";

// Middleware for validating POST /products
export const validateCreateProduct = async (ctx: any) => {
	try {
		const body = ctx.body || {};

		// Validate the DTO
		const validated = CreateProductDto.parse({
			title: body.title ? body.title : "New Product",
			description: body.description,
			price: body.price ? parseFloat(body.price) : undefined,
			discountPercent: body.discountPercent
				? parseInt(body.discountPercent)
				: undefined,
			discountedPrice: body.discountedPrice
				? parseFloat(body.discountedPrice)
				: undefined,
			sponsorPrice: body.sponsorPrice
				? parseFloat(body.sponsorPrice)
				: undefined,
			order: body.order ? parseInt(body.order) : undefined,
			subCategoryId: body.subCategoryId,
			images: body.images, // Array of File objects
		});

		// Attach validated data to context
		ctx.validatedData = validated;
	} catch (error) {
		if (error instanceof z.ZodError) {
			ctx.set.status = 400;
			return { error: "Validation failed", details: error.issues };
		}
		ctx.set.status = 400;
		return { error: "Invalid request" };
	}
};

// Middleware for validating PUT /products/:id
export const validateUpdateProduct = async (ctx: any) => {
	try {
		const body = ctx.body || {};

		// Validate the DTO
		const validated = UpdateProductDto.parse({
			title: body.title,
			description: body.description,
			price: body.price ? parseFloat(body.price) : undefined,
			discountPercent: body.discountPercent
				? parseInt(body.discountPercent)
				: undefined,
			discountedPrice: body.discountedPrice
				? parseFloat(body.discountedPrice)
				: undefined,
			sponsorPrice: body.sponsorPrice
				? parseFloat(body.sponsorPrice)
				: undefined,
			order: body.order ? parseInt(body.order) : undefined,
			subCategoryId: body.subCategoryId,
		});

		// Attach validated data to context
		ctx.validatedData = validated;
		return null; // success
	} catch (error) {
		if (error instanceof z.ZodError) {
			ctx.set.status = 400;
			return { error: "Validation failed", details: error.issues };
		}
		ctx.set.status = 400;
		return { error: "Invalid request" };
	}
};
