// src/modules/categories/categories.route.ts
import { categoryController } from "./categories.controller";
import { subCategoryController } from "../subCategories/subCategories.controller";
import { requireAuth, requireRole } from "../auth/auth.middleware";
import { secureRoute } from "../../utils/securityRoute";
import {
	validateCreateCategory,
	validateUpdateCategory,
} from "./categories.middleware";
import { t } from "elysia";

export function registerCategoryRoutes(router: any) {
	// ============================================
	// PUBLIC ROUTES (no authentication required)
	// ============================================

	// Get all categories
	router.get("/categories", async (ctx: any) => {
		return categoryController.getAll(ctx);
	});

	// Get category by ID
	router.get("/categories/:id", async (ctx: any) => {
		return categoryController.getById(ctx);
	});

	// Get all subcategories for a category
	router.get("/categories/:id/subcategories", async (ctx: any) => {
		return subCategoryController.getAllByCategory(ctx);
	});

	// ============================================
	// ADMIN ROUTES (requires SUPER_ADMIN role)
	// ============================================

	// Create category — JSON body
	router.post(
		"/categories",
		async (ctx: any) => {
			const validationResult = await validateCreateCategory(ctx);
			if (validationResult) return validationResult;
			return categoryController.create(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
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
			const validationResult = await validateUpdateCategory(ctx);
			if (validationResult) return validationResult;
			return categoryController.update(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				order: t.Optional(t.Numeric()),
			}),
			type: "json",
		},
		secureRoute()
	);

	// Delete category
	router.delete(
		"/categories/:id",
		async (ctx: any) => {
			return categoryController.delete(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
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
			return categoryController.deleteImage(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		},
		secureRoute()
	);

	// Reorder categories — JSON body with items array
	router.put(
		"/categories/reorder",
		async (ctx: any) => {
			return categoryController.reorder(ctx);
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
		},
		secureRoute()
	);
}
