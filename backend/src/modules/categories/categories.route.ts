// src/modules/category/category.routes.ts
import { categoryController } from "./categories.controller";
import { verifyAccessToken } from "../../utils/jwt";
import { secureRoute } from "../../utils/securityRoute";

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

export function registerCategoryRoutes(router: any) {
	router.get("/categories", async (ctx: any) => {
		const authResult = await authenticateSuperAdmin(ctx);
		if (authResult) return authResult;
		return categoryController.getAll(ctx);
	});

	router.get("/categories/:id", async (ctx: any) => {
		const authResult = await authenticateSuperAdmin(ctx);
		if (authResult) return authResult;
		return categoryController.getById(ctx);
	});

	router.post(
		"/categories",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.create(ctx);
		},
		secureRoute()
	);

	router.put(
		"/categories/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.update(ctx);
		},
		secureRoute()
	);

	router.delete(
		"/categories/:id",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.delete(ctx);
		},
		secureRoute()
	);

	router.put(
		"/categories/reorder",
		async (ctx: any) => {
			const authResult = await authenticateSuperAdmin(ctx);
			if (authResult) return authResult;
			return categoryController.reorder(ctx);
		},
		secureRoute()
	);
}
