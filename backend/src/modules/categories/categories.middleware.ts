import { z } from "zod";
import { CreateCategoryDto, UpdateCategoryDto } from "./categories.types";

// Middleware for validating POST /categories
export const validateCreateCategory = async (ctx: any) => {
	try {
		// For multipart/form-data, body is in ctx.body
		const body = ctx.body || {};

		// Validate the DTO
		const validated = CreateCategoryDto.parse({
			title: body.title ? body.title : "New Category",
			order: body.order ? parseInt(body.order) : undefined,
			image: body.image, // File object
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

// Middleware for validating PUT /categories/:id
export const validateUpdateCategory = async (ctx: any) => {
	try {
		const body = ctx.body || {};

		// Validate the DTO
		const validated = UpdateCategoryDto.parse({
			title: body.title,
			order: body.order ? parseInt(body.order) : undefined,
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
