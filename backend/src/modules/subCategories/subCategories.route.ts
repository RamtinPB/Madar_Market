// src/modules/subCategories/subCategories.route.ts
import { subCategoryService } from "./subCategories.service";
import { requireAuth } from "../../infrastructure/auth/auth.guard";
import { requireRole } from "../../infrastructure/auth/role.guard";
import {
	CreateSubCategorySchema,
	UpdateSubCategorySchema,
} from "./subCategories.schema";
import { t } from "elysia";

export function registerSubCategoryRoutes(router: any) {
	// ===============================
	// SUPER ADMIN AUTHENTICATED ROUTES
	// ===============================

	// Get subcategory by ID
	router.get(
		"/sub-categories/:id",
		async (ctx: any) => {
			return subCategoryService.getById(ctx.params.id);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Create subcategory — JSON body
	router.post(
		"/sub-categories",
		async (ctx: any) => {
			const body = CreateSubCategorySchema.parse(ctx.body);
			return subCategoryService.create(body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				categoryId: t.String(),
			}),
			type: "json",
		}
	);

	// Update subcategory metadata (title + categoryId) — JSON body
	router.put(
		"/sub-categories/:id",
		async (ctx: any) => {
			const body = UpdateSubCategorySchema.parse(ctx.body);
			return subCategoryService.update(ctx.params.id, body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				categoryId: t.Optional(t.String()),
			}),
			type: "json",
		}
	);

	// Delete subcategory
	router.delete(
		"/sub-categories/:id",
		async (ctx: any) => {
			return subCategoryService.delete(ctx.params.id);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Reorder subcategories — JSON body with items array (ID-based ordering)
	router.put(
		"/sub-categories/reorder/:categoryId",
		async (ctx: any) => {
			return subCategoryService.reorder(ctx.params.id, ctx.body);
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
		return subCategoryService.getAllProducts(ctx.params.id);
	});
}
