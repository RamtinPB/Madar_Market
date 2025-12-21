// src/modules/categories/categories.route.ts
import { categoryService } from "./categories.service";
import { subCategoryService } from "../subCategories/subCategories.service";
import { requireAuth } from "../../infrastructure/auth/auth.guard";
import { requireRole } from "../../infrastructure/auth/role.guard";
import { secureRoute } from "../../shared/http/swagger";
import {
	CreateCategorySchema,
	UpdateCategorySchema,
} from "./categories.schema";
import { t } from "elysia";

export function registerCategoryRoutes(router: any) {
	// ============================================
	// PUBLIC ROUTES (no authentication required)
	// ============================================

	// Get all categories
	router.get("/categories", async () => {
		return categoryService.getAll();
	});

	// Get category by businessId
	router.get("/categories/:id", async (ctx: any) => {
		return categoryService.getById(ctx.params.id);
	});

	// Get all subcategories for a category
	router.get("/categories/:id/subcategories", async (ctx: any) => {
		return subCategoryService.getAllByCategory(ctx.params.id);
	});

	// ============================================
	// ADMIN ROUTES (requires SUPER_ADMIN role)
	// ============================================

	// Create category — JSON body
	router.post(
		"/categories",
		async (ctx: any) => {
			const body = CreateCategorySchema.parse(ctx.body);
			return categoryService.create(body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
			}),
			type: "json",
		},
		secureRoute()
	);

	// Update metadata (title) — JSON body
	router.put(
		"/categories/:id",
		async (ctx: any) => {
			const body = UpdateCategorySchema.parse(ctx.body);
			return categoryService.update(ctx.params.id, body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
			}),
			type: "json",
		},
		secureRoute()
	);

	// Delete category
	router.delete(
		"/categories/:id",
		async (ctx: any) => {
			return categoryService.delete(ctx.params.id);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		},
		secureRoute()
	);

	// Upload/replace image — multipart/form-data with 'image' file
	router.put(
		"/categories/:id/image",
		async (ctx: any) => {
			return categoryService.uploadImage(ctx.params.id, ctx.body.image);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				image: t.File(),
			}),
			type: "multipart/form-data",
		}
	);

	// // get image upload url
	// router.post(
	// 	"/categories/:id/image-upload-url",
	// 	categoryService.getCategoryImageUploadUrl,
	// 	{
	// 		beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
	// 	}
	// );

	// Delete image
	router.delete(
		"/categories/:id/image",
		async (ctx: any) => {
			return categoryService.deleteImage(ctx.params.id);
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
			return categoryService.reorder(ctx.body.items);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				items: t.Array(
					t.Object({
						businessId: t.String(),
						order: t.Numeric(),
					})
				),
			}),
		},
		secureRoute()
	);
}
