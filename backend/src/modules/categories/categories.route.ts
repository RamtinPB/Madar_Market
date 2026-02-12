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
		return categoryService.getAllCategories();
	});

	// Get category by publicId
	router.get("/categories/:categoryPublicId", async (ctx: any) => {
		return categoryService.getCategoryByPublicId(ctx.params.categoryPublicId);
	});

	// Get all subcategories for a category
	router.get(
		"/categories/:categoryPublicId/subcategories",
		async (ctx: any) => {
			return subCategoryService.getAllByCategory(ctx.params.categoryPublicId);
		},
	);

	// ============================================
	// ADMIN ROUTES (requires SUPER_ADMIN role)
	// ============================================

	// Create category — JSON body
	router.post(
		"/categories",
		async (ctx: any) => {
			const body = CreateCategorySchema.parse(ctx.body);
			return categoryService.createNewCategory(body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
			}),
			type: "json",
		},
		secureRoute(),
	);

	// Update metadata (title) — JSON body
	router.put(
		"/categories/:categoryPublicId",
		async (ctx: any) => {
			const body = UpdateCategorySchema.parse(ctx.body);
			return categoryService.updateCategory(ctx.params.categoryPublicId, body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
			}),
			type: "json",
		},
		secureRoute(),
	);

	// Delete category
	router.delete(
		"/categories/:categoryPublicId",
		async (ctx: any) => {
			return categoryService.deleteCategory(ctx.params.categoryPublicId);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		},
		secureRoute(),
	);

	// Upload/replace image — multipart/form-data with 'image' file
	router.put(
		"/categories/:categoryPublicId/image",
		async (ctx: any) => {
			return categoryService.uploadCategoryImage(
				ctx.params.categoryPublicId,
				ctx.body.image,
			);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				image: t.File(),
			}),
			type: "multipart/form-data",
		},
	);

	// // get image upload url
	// router.post(
	// 	"/categories/:categoryPublicId/image-upload-url",
	// 	categoryService.getCategoryImageUploadUrl,
	// 	{
	// 		beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
	// 	}
	// );

	// Delete image
	router.delete(
		"/categories/:categoryPublicId/image",
		async (ctx: any) => {
			return categoryService.deleteCategoryImage(ctx.params.categoryPublicId);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		},
		secureRoute(),
	);
}
