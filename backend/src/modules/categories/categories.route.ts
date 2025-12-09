// src/modules/category/category.routes.ts
import { categoryController } from "./categories.controller";
import { subCategoryController } from "../subCategories/subCategories.controller";
import { productController } from "../product/products.controller";
import { verifyAccessToken } from "../../utils/jwt";
import { secureRoute } from "../../utils/securityRoute";
import {
	validateCreateCategory,
	validateUpdateCategory,
} from "./categories.middleware";
import { t } from "elysia";

async function authenticateSuperAdmin(ctx: any) {
	const auth = ctx.request.headers.get("authorization") || "";
	const parts = auth.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		ctx.set.status = 401;
		return { error: "Unauthorized" };
	}

	const token = parts[1];
	try {
		const payload: any = await verifyAccessToken(token);
		const user = { id: payload.userId, role: payload.role };
		if (user.role !== "SUPER_ADMIN") {
			ctx.set.status = 403;
			return { error: "Forbidden" };
		}
		ctx.user = user;
		return null; // continue
	} catch (error) {
		ctx.set.status = 401;
		return { error: "Invalid token" };
	}
}

export function registerCategoryRoutes(router: any) {
	router.get("/categories/get-all", async (ctx: any) => {
		const authResult = await authenticateSuperAdmin(ctx);
		if (authResult) return authResult;
		return categoryController.getAll(ctx);
	});

	router.get("/categories/get/:id", async (ctx: any) => {
		const authResult = await authenticateSuperAdmin(ctx);
		if (authResult) return authResult;
		return categoryController.getById(ctx);
	});

	// Create category — allow optional image (multipart/form-data)
	router.post(
		"/categories/create",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateCreateCategory(ctx);
			if (validationResult) return validationResult;
			return categoryController.create(ctx);
		},
		// {
		// 	// title required, order optional, image optional file
		// 	body: t.Object({
		// 		title: t.Optional(t.String()),
		// 		order: t.Optional(t.Numeric()),
		// 		image: t.Optional(t.File()), // t.File => multipart/form-data
		// 	}),
		// 	// explicit type is optional but explicit is fine:
		// 	type: "multipart/form-data",
		// },
		secureRoute()
	);

	// Update metadata (title + order) — JSON body
	router.put(
		"/categories/edit/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateUpdateCategory(ctx);
			if (validationResult) return validationResult;
			return categoryController.update(ctx);
		},
		{
			// Only title and order — JSON expected
			body: t.Object({
				title: t.Optional(t.String()),
				order: t.Optional(t.Numeric()),
			}),
			// Elysia will default to JSON parsing for t.Object, but you can set:
			type: "json",
		},
		secureRoute()
	);

	// Delete category
	router.delete(
		"/categories/delete/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.delete(ctx);
		},
		secureRoute()
	);

	// Upload/replace image — multipart/form-data with 'image' file
	router.put(
		"/categories/edit-image/:id/image",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.uploadImage(ctx);
		},
		{
			body: t.Object({
				image: t.File(), // required file field
			}),
			type: "multipart/form-data",
		},
		secureRoute()
	);

	// Delete image
	router.delete(
		"/categories/delete-image/:id/image",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.deleteImage(ctx);
		},
		secureRoute()
	);

	// Reorder categories — JSON body with items array
	router.put(
		"/categories/reorder",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.reorder(ctx);
		},
		{
			body: t.Object({
				items: t.Array(
					t.Object({
						id: t.String(),
						order: t.Numeric(),
					})
				),
			}),
		},
		secureRoute()
	);

	// Get all subcategories for a category
	router.get(
		"/categories/:categoryId/get-all-subcategories",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return subCategoryController.getAllByCategory(ctx);
		}
	);

	// Get all products for a subcategory
	router.get(
		"/categories/:categoryId/:subCategoryId/get-all-products",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return productController.getAllBySubCategory(ctx);
		}
	);
}
