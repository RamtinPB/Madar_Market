// src/modules/product/products.route.ts
import { productController } from "./products.controller";
import { requireAuth, requireRole } from "../auth/auth.middleware";
import {
	validateCreateProduct,
	validateUpdateProduct,
} from "./products.middleware";
import { t } from "elysia";

export function registerProductRoutes(router: any) {
	// ===============================
	// SUPER ADMIN AUTHENTICATED ROUTES
	// ===============================

	// Get product by ID
	router.get(
		"/products/:id",
		async (ctx: any) => {
			return productController.getById(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Create product — JSON body, no images
	router.post(
		"/products",
		async (ctx: any) => {
			const validationResult = await validateCreateProduct(ctx);
			if (validationResult) return validationResult;
			return productController.create(ctx);
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
			const validationResult = await validateUpdateProduct(ctx);
			if (validationResult) return validationResult;
			return productController.update(ctx);
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
			return productController.delete(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Reorder products — JSON body with items array
	router.put(
		"/products/reorder/:subCategoryId",
		async (ctx: any) => {
			return productController.reorder(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				items: t.Array(
					t.Object({
						id: t.String(),
						order: t.Number(),
					})
				),
			}),
		}
	);

	// ===============================
	// PRODUCT IMAGE MANAGEMENT ROUTES (SUPER ADMIN AUTHENTICATED)
	// ===============================

	// Upload/replace images — multipart/form-data
	router.put(
		"/products/:id/images",
		async (ctx: any) => {
			return productController.uploadImages(ctx);
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
			return productController.deleteImage(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// NEW: Delete image by filename
	router.delete(
		"/products/:id/images/by-filename",
		async (ctx: any) => {
			return productController.deleteImageByFilename(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// NEW: Delete image by URL parameter
	router.delete(
		"/products/:id/images/by-url",
		async (ctx: any) => {
			return productController.deleteImageByUrlParameter(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);

	// Reorder product images — JSON body
	router.put(
		"/products/:id/images/reorder",
		async (ctx: any) => {
			return productController.reorderImages(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
			body: t.Object({
				items: t.Array(
					t.Object({
						id: t.String(),
						order: t.Number(),
					})
				),
			}),
		}
	);

	// Get upload URL for product image
	router.get(
		"/products/:id/upload-url",
		async (ctx: any) => {
			return productController.getProductImageUploadUrl(ctx);
		},
		{
			beforeHandle: [requireAuth, requireRole("SUPER_ADMIN")],
		}
	);
}
