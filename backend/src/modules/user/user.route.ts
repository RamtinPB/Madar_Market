import { Elysia, t } from "elysia";
import {
	getAllUsers,
	updateUserRole,
	deleteUser,
	getUserById,
} from "./user.controller";
import { getUserFromToken } from "../../utils/auth";

export const userRoutes = new Elysia({ prefix: "/users" })
	.get("/getAllUsers", () => getAllUsers())
	.get("/getUserById/:id", ({ params }) => getUserById(Number(params.id)))
	.put(
		"/:id/role",
		async ({ params, body, request }) => {
			// Only SUPER_ADMIN can change roles
			const token = request.headers.get("authorization") ?? undefined;
			const authUser = await getUserFromToken(token);
			if (!authUser || authUser.role !== "SUPER_ADMIN") {
				return new Response(JSON.stringify({ error: "Unauthorized" }), {
					status: 403,
					headers: { "Content-Type": "application/json" },
				});
			}
			return updateUserRole(Number(params.id), (body as any).role);
		},
		{
			body: t.Object({ role: t.String() }),
		}
	)
	.delete("/:id", async ({ params, request }) => {
		const token = request.headers.get("authorization") ?? undefined;
		const authUser = await getUserFromToken(token);
		if (!authUser || authUser.role !== "SUPER_ADMIN") {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 403,
				headers: { "Content-Type": "application/json" },
			});
		}
		return deleteUser(Number(params.id));
	});
