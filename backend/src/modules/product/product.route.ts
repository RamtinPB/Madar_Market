import { Elysia } from "elysia";
import { prisma } from "../../utils/prisma";

export const productRoutes = new Elysia({ prefix: "/products" }).get(
	"/",
	async () => {}
);
