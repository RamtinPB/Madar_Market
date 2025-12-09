import { Elysia } from "elysia";

import { registerAuthRoutes } from "./modules/auth/auth.route";

import { staticPlugin } from "@elysiajs/static";

import cors from "@elysiajs/cors";
import { registerCategoryRoutes } from "./modules/categories/categories.route";
import swagger from "@elysiajs/swagger";

export const app = new Elysia()
	.use(
		cors({
			origin: "http://localhost:3000",
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		})
	)
	.use(
		staticPlugin({
			assets: "public",
			prefix: "/static",
		})
	)
	.get("/", () => ({ status: "ok", message: "Backend is running" }))
	.use(
		swagger({
			documentation: {
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
						},
					},
				},
			},
		})
	);

registerAuthRoutes(app);
registerCategoryRoutes(app);

// Test route for authentication
app.get("/test-auth", async (ctx: any) => {
	const auth = ctx.request.headers.get("authorization") || "";
	const parts = auth.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		ctx.set.status = 401;
		return { error: "Unauthorized" };
	}

	const token = parts[1];
	try {
		const { verifyAccessToken } = await import("./utils/jwt");
		const payload: any = verifyAccessToken(token);
		const user = { id: payload.userId, role: payload.role };
		if (user.role !== "SUPER_ADMIN") {
			ctx.set.status = 403;
			return { error: "Forbidden" };
		}
		return {
			message: "Authentication successful",
			user,
		};
	} catch (error) {
		ctx.set.status = 401;
		return { error: "Invalid token" };
	}
});

app.listen(4000);

console.log("🚀 Backend running on http://localhost:4000");

/*
app.group('/user', group => {
	group.use(requireAuth);

	group.get('/me', getprofile);
})
*/
