// src/modules/product/products.route.ts
import { requireAuth } from "../../infrastructure/auth/auth.guard";
import { requireRole } from "../../infrastructure/auth/role.guard";
import { t } from "elysia";
import {
	CreateProductSchema,
	ReorderProductsSchema,
	UpdateProductSchema,
	UploadProductImagesSchema,
} from "./products.schema";
import { productService } from "./products.service";

export function registerProductRoutes(router: any) {
	// ===============================
	// SUPER ADMIN AUTHENTICATED ROUTES
	// ===============================

	// Get product by ID
	router.get(
		"/products/:id",
		async (ctx: any) => {
			return productService.getById(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Create product — JSON body, no images
	router.post(
		"/products",
		async (ctx: any) => {
			const body = CreateProductSchema.parse(ctx.body);
			return productService.create(body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				description: t.Optional(t.String()),
				price: t.Optional(t.Number()),
				discountPercent: t.Optional(t.Number()),
				discountedPrice: t.Optional(t.Number()),
				sponsorPrice: t.Optional(t.Number()),
				order: t.Optional(t.Number()),
				subCategoryId: t.String(),
				attributes: t.Optional(
					t.Array(
						t.Object({
							title: t.Optional(t.String()),
							description: t.Optional(t.String()),
							order: t.Optional(t.Number()),
						})
					)
				),
			}),
			type: "json",
		}
	);

	// Update product metadata — JSON body
	router.put(
		"/products/:id",
		async (ctx: any) => {
			const body = UpdateProductSchema.parse(ctx.body);
			return productService.update(ctx.id, body);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				title: t.Optional(t.String()),
				description: t.Optional(t.String()),
				price: t.Optional(t.Number()),
				discountPercent: t.Optional(t.Number()),
				discountedPrice: t.Optional(t.Number()),
				sponsorPrice: t.Optional(t.Number()),
				order: t.Optional(t.Number()),
				subCategoryId: t.Optional(t.String()),
				attributes: t.Optional(
					t.Array(
						t.Object({
							title: t.Optional(t.String()),
							description: t.Optional(t.String()),
							order: t.Optional(t.Number()),
						})
					)
				),
			}),
			type: "json",
		}
	);

	// Delete product
	router.delete(
		"/products/:id",
		async (ctx: any) => {
			// place zod validation here <---
			return productService.delete(ctx.id);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// // Reorder products — JSON body with items array
	// router.put(
	// 	"/products/reorder/:subCategoryId",
	// 	async (ctx: any) => {
	// 		const body = ReorderProductsSchema.parse(ctx.body);
	// 		return productService.reorder(ctx.subCategoryId, body);
	// 	},
	// 	{
	// 		beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
	// 		body: t.Object({
	// 			items: t.Array(
	// 				t.Object({
	// 					id: t.String(),
	// 					order: t.Number(),
	// 				})
	// 			),
	// 		}),
	// 	}
	// );

	// ===============================
	// PRODUCT IMAGE MANAGEMENT ROUTES (SUPER ADMIN AUTHENTICATED)
	// ===============================

	// Upload/replace images — multipart/form-data
	router.put(
		"/products/:id/images",
		async (ctx: any) => {
			const body = UploadProductImagesSchema.parse(ctx.body);
			return productService.uploadImages(ctx.id, ctx); // should be body - check error later <---
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				images: t.Union([t.File(), t.Array(t.File())]),
			}),
			type: "multipart/form-data",
		}
	);

	// Delete specific image by ID
	router.delete(
		"/products/:id/images/:imageId",
		async (ctx: any) => {
			return productService.deleteImage(ctx.id, ctx.imageId);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// // NEW: Delete image by filename
	// router.delete(
	// 	"/products/:id/images/by-filename",
	// 	async (ctx: any) => {
	// 		return productService.deleteImageByFilename(ctx);
	// 	},
	// 	{
	// 		beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
	// 	}
	// );

	// NEW: Delete image by URL parameter
	router.delete(
		"/products/:id/images/by-url",
		async (ctx: any) => {
			return productService.deleteImageByUrlParameter(ctx.id, ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// // Reorder product images — JSON body
	// router.put(
	// 	"/products/:id/images/reorder",
	// 	async (ctx: any) => {
	// 		return productService.reorderImages(ctx);
	// 	},
	// 	{
	// 		beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
	// 		body: t.Object({
	// 			items: t.Array(
	// 				t.Object({
	// 					id: t.String(),
	// 					order: t.Number(),
	// 				})
	// 			),
	// 		}),
	// 	}
	// );

	// // Get upload URL for product image
	// router.get(
	// 	"/products/:id/upload-url",
	// 	async (ctx: any) => {
	// 		return productService.getProductImageUploadUrl(ctx);
	// 	},
	// 	{
	// 		beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
	// 	}
	// );
}
