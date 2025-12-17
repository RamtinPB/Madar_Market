// src/modules/categories/categories.route.ts
import { categoryController } from "./categories.controller";
import { subCategoryController } from "../subCategories/subCategories.controller";
import { verifyAccessToken } from "../../utils/jwt";
import { requireAuth, requireRole } from "../auth/auth.middleware";
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
	router.get("/categories", async (ctx: any) => {
		return categoryController.getAll(ctx);
	});

	router.get(
		"/categories/:id",
		async (ctx: any) => {
			return categoryController.getById(ctx);
		},
		{
			beforehandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Create category — JSON body
	router.post(
		"/categories",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateCreateCategory(ctx);
			if (validationResult) return validationResult;
			return categoryController.create(ctx);
		},
		{
			body: t.Object({
				title: t.Optional(t.String()),
				order: t.Optional(t.Numeric()),
			}),
			type: "json",
		},
		secureRoute()
	);

	// Update metadata (title + order) — JSON body
	router.put(
		"/categories/:id",
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
		"/categories/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.delete(ctx);
		},
		secureRoute()
	);

	// Upload/replace image — multipart/form-data with 'image' file
	router.post(
		"/categories/:id/image-upload-url",
		categoryController.getCategoryImageUploadUrl,
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Delete image
	router.delete(
		"/categories/:id/image",
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
	router.get("/categories/:id/subcategories", async (ctx: any) => {
		// const authResult = await authenticateSuperAdmin(ctx);
		// if (authResult) return authResult;
		return subCategoryController.getAllByCategory(ctx);
	});
}
