import { Elysia } from "elysia";
import { userRoutes } from "./modules/user/user.route";
import { registerAuthRoutes } from "./modules/auth/auth.route";
import { categoriesRoutes } from "./modules/categories/categories.route";
import { staticPlugin } from "@elysiajs/static";
import { productRoutes } from "./modules/product/product.route";
import cors from "@elysiajs/cors";
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
	.use(swagger());

registerAuthRoutes(app);

app.listen(4000);

console.log("🚀 Backend running on http://localhost:4000");

/*
app.group('/user', group => {
	group.use(requireAuth);

	group.get('/me', getprofile);
})
*/
