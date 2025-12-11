// src/modules/subCategories/subCategories.route.ts
import { subCategoryController } from "./subCategories.controller";
import { verifyAccessToken } from "../../utils/jwt";
import { secureRoute } from "../../utils/securityRoute";
import {
	validateCreateSubCategory,
	validateUpdateSubCategory,
} from "./subCategories.middleware";
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

export function registerSubCategoryRoutes(router: any) {
	router.get("/subcategories/get/:id", async (ctx: any) => {
		const authResult = await authenticateSuperAdmin(ctx);
		if (authResult) return authResult;
		return subCategoryController.getById(ctx);
	});

	// Create subcategory — JSON body
	router.post(
		"/subcategories/create",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateCreateSubCategory(ctx);
			if (validationResult) return validationResult;
			return subCategoryController.create(ctx);
		},
		{
			body: t.Object({
				title: t.Optional(t.String()),
				categoryId: t.String(),
				order: t.Optional(t.Numeric()),
			}),
			type: "json",
		},
		secureRoute()
	);

	// Update subcategory metadata (title + order + categoryId) — JSON body
	router.put(
		"/subcategories/edit/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateUpdateSubCategory(ctx);
			if (validationResult) return validationResult;
			return subCategoryController.update(ctx);
		},
		{
			body: t.Object({
				title: t.Optional(t.String()),
				categoryId: t.Optional(t.String()),
				order: t.Optional(t.Numeric()),
			}),
			type: "json",
		},
		secureRoute()
	);

	// Delete subcategory
	router.delete(
		"/subcategories/delete/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return subCategoryController.delete(ctx);
		},
		secureRoute()
	);

	// Reorder subcategories — JSON body with items array
	router.put(
		"/subcategories/reorder/:categoryId",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return subCategoryController.reorder(ctx);
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

	// Get all products for a subcategory
	router.get(
		"/subcategories/:subCategoryId/get-all-products",
		async (ctx: any) => {
			// const authResult = await authenticateSuperAdmin(ctx);
			// if (authResult) return authResult;
			return subCategoryController.getAllProducts(ctx);
		}
	);
}
