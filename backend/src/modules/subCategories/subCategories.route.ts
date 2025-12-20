// src/modules/subCategories/subCategories.route.ts
import { subCategoryService } from "./subCategories.service";
import { requireAuth, requireRole } from "../../infrastructure/auth/auth.guard";
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
			return subCategoryService.getById(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Create subcategory — JSON body
	router.post(
		"/sub-categories",
		async (ctx: any) => {
			const body = await CreateSubCategorySchema.parse(ctx.body);
			return subCategoryService.create(body);
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
			const body = await UpdateSubCategorySchema.parse(ctx.body);
			return subCategoryService.update(ctx.id, body);
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
			return subCategoryService.delete(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Reorder subcategories — JSON body with items array
	router.put(
		"/sub-categories/reorder/:categoryId",
		async (ctx: any) => {
			return subCategoryService.reorder(ctx.id, ctx.body);
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
		return subCategoryService.getAllProducts(ctx);
	});
}
