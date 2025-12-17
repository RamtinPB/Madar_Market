// src/modules/subCategories/subCategories.route.ts
import { subCategoryController } from "./subCategories.controller";
import { requireAuth, requireRole } from "../auth/auth.middleware";
import {
	validateCreateSubCategory,
	validateUpdateSubCategory,
} from "./subCategories.middleware";
import { t } from "elysia";

export function registerSubCategoryRoutes(router: any) {
	// ===============================
	// SUPER ADMIN AUTHENTICATED ROUTES
	// ===============================

	// Get subcategory by ID
	router.get(
		"/sub-categories/:id",
		async (ctx: any) => {
			return subCategoryController.getById(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Create subcategory — JSON body
	router.post(
		"/sub-categories",
		async (ctx: any) => {
			const validationResult = await validateCreateSubCategory(ctx);
			if (validationResult) return validationResult;
			return subCategoryController.create(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				categoryId: t.String(),
				order: t.Optional(t.Numeric()),
			}),
			type: "json",
		}
	);

	// Update subcategory metadata (title + order + categoryId) — JSON body
	router.put(
		"/sub-categories/:id",
		async (ctx: any) => {
			const validationResult = await validateUpdateSubCategory(ctx);
			if (validationResult) return validationResult;
			return subCategoryController.update(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				categoryId: t.Optional(t.String()),
				order: t.Optional(t.Numeric()),
			}),
			type: "json",
		}
	);

	// Delete subcategory
	router.delete(
		"/sub-categories/:id",
		async (ctx: any) => {
			return subCategoryController.delete(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Reorder subcategories — JSON body with items array
	router.put(
		"/sub-categories/reorder/:categoryId",
		async (ctx: any) => {
			return subCategoryController.reorder(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				items: t.Array(
					t.Object({
						id: t.String(),
						order: t.Numeric(),
					})
				),
			}),
		}
	);

	// ===============================
	// PUBLIC ROUTES (No Authentication Required)
	// ===============================

	// Get all products for a subcategory
	router.get("/sub-categories/:id/products", async (ctx: any) => {
		return subCategoryController.getAllProducts(ctx);
	});
}
