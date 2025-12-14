// src/modules/product/products.route.ts
import { productController } from "./products.controller";
import { verifyAccessToken } from "../../utils/jwt";
import { secureRoute } from "../../utils/securityRoute";
import {
	validateCreateProduct,
	validateUpdateProduct,
} from "./products.middleware";
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

export function registerProductRoutes(router: any) {
	router.get("/products/get/:id", async (ctx: any) => {
		const authResult = await authenticateSuperAdmin(ctx);
		if (authResult) return authResult;
		return productController.getById(ctx);
	});

	// Create product — JSON body, no images
	router.post(
		"/products/create",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateCreateProduct(ctx);
			if (validationResult) return validationResult;
			return productController.create(ctx);
		},
		{
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
		},
		secureRoute()
	);

	// Update product metadata — JSON body
	router.put(
		"/products/edit/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			const validationResult = await validateUpdateProduct(ctx);
			if (validationResult) return validationResult;
			return productController.update(ctx);
		},
		{
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
		},
		secureRoute()
	);

	// Delete product
	router.delete(
		"/products/delete/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return productController.delete(ctx);
		},
		secureRoute()
	);

	// Reorder products — JSON body with items array
	router.put(
		"/products/reorder/:subCategoryId",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return productController.reorder(ctx);
		},
		{
			body: t.Object({
				items: t.Array(
					t.Object({
						id: t.String(),
						order: t.Number(),
					})
				),
			}),
		},
		secureRoute()
	);

	// Upload/replace images — multipart/form-data
	router.put(
		"/products/upload-images/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return productController.uploadImages(ctx);
		},
		{
			body: t.Object({
				images: t.Union([t.File(), t.Array(t.File())]),
			}),
			type: "multipart/form-data",
		},
		secureRoute()
	);

	// Delete specific image
	router.delete(
		"/products/delete-image/:id/:imageId",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return productController.deleteImage(ctx);
		},
		secureRoute()
	);

	// Reorder product images — JSON body
	router.put(
		"/products/reorder-images/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return productController.reorderImages(ctx);
		},
		{
			body: t.Object({
				items: t.Array(
					t.Object({
						id: t.String(),
						order: t.Number(),
					})
				),
			}),
		},
		secureRoute()
	);
}
