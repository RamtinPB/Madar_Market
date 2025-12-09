import { z } from "zod";
import {
	CreateSubCategoryDto,
	UpdateSubCategoryDto,
} from "./subCategories.types";

// Middleware for validating POST /subcategories
export const validateCreateSubCategory = async (ctx: any) => {
	try {
		const body = ctx.body || {};

		// Validate the DTO
		const validated = CreateSubCategoryDto.parse({
			title: body.title ? body.title : "New SubCategory",
			categoryId: body.categoryId,
			order: body.order ? parseInt(body.order) : undefined,
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

// Middleware for validating PUT /subcategories/:id
export const validateUpdateSubCategory = async (ctx: any) => {
	try {
		const body = ctx.body || {};

		// Validate the DTO
		const validated = UpdateSubCategoryDto.parse({
			title: body.title,
			categoryId: body.categoryId,
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
