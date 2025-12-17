import "dotenv/config";
import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

import { registerAuthRoutes } from "./modules/auth/auth.route";
import { registerCategoryRoutes } from "./modules/categories/categories.route";
import { registerSubCategoryRoutes } from "./modules/subCategories/subCategories.route";
import { registerProductRoutes } from "./modules/product/products.route";

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
			prefix: "/public",
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
registerSubCategoryRoutes(app);
registerProductRoutes(app);

app.listen(4000);

console.log("🚀 Backend running on http://localhost:4000");

/*
app.group('/user', group => {
	group.use(requireAuth);

	group.get('/me', getprofile);
})
*/
