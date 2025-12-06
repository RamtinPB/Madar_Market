import { Elysia, t } from "elysia";
import {
	getCategories,
	createCategory,
	getCategoryById,
	updateCategory,
	deleteCategory,
} from "./categories.controller";
import { getUserFromToken } from "../../utils/auth";

// Categories routes
export const categoriesRoutes = new Elysia({ prefix: "/categories" })
	// Fetch all categories
	.get("/", async ({ request }) => {
		// Build base url for this request; prefer explicit BACKEND_URL env var
		const envUrl = process.env.BACKEND_URL;
		const proto = request.headers.get("x-forwarded-proto") ?? "http";
		const host = request.headers.get("host") ?? "localhost:4000";
		const baseUrl = envUrl ?? `${proto}://${host}`;

		// Fetch categories
		const data = await getCategories(baseUrl);
		return new Response(JSON.stringify(data), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	})
	// Create new category
	.post(
		"/",
		async ({ body, request }) => {
			const token = request.headers.get("authorization") ?? undefined;
			const user = await getUserFromToken(token);
			if (!user || (user.role !== "SUB_ADMIN" && user.role !== "SUPER_ADMIN")) {
				return new Response(JSON.stringify({ error: "Unauthorized" }), {
					status: 403,
					headers: { "Content-Type": "application/json" },
				});
			}
			const created = await createCategory(
				body as { label: string; imageUrl: string; order?: number }
			);

			return new Response(JSON.stringify(created), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		},
		{
			body: t.Object({
				label: t.String(),
				imageUrl: t.String(),
				order: t.Optional(t.Number()),
			}),
		}
	)
	.get("/:id", ({ params }) => getCategoryById(params.id))
	.put(
		"/:id",
		async ({ params, body, request }) => {
			const token = request.headers.get("authorization") ?? undefined;
			const user = await getUserFromToken(token);
			if (!user || (user.role !== "SUB_ADMIN" && user.role !== "SUPER_ADMIN")) {
				return new Response(JSON.stringify({ error: "Unauthorized" }), {
					status: 403,
					headers: { "Content-Type": "application/json" },
				});
			}
			const updated = await updateCategory(params.id, body as any);
			return new Response(JSON.stringify(updated), {
				headers: {
					"Content-Type": "application/json",
				},
			});
		},
		{
			body: t.Object({
				label: t.Optional(t.String()),
				imageUrl: t.Optional(t.String()),
				order: t.Optional(t.Number()),
			}),
		}
	)
	.delete("/:id", async ({ params, request }) => {
		const token = request.headers.get("authorization") ?? undefined;
		const user = await getUserFromToken(token);
		if (!user || (user.role !== "SUB_ADMIN" && user.role !== "SUPER_ADMIN")) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 403,
				headers: { "Content-Type": "application/json" },
			});
		}
		const deleted = await deleteCategory(params.id);
		return new Response(JSON.stringify(deleted), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	});
