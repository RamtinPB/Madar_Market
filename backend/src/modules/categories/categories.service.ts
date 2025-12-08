// src/modules/category/category.service.ts
import { prisma } from "../../utils/prisma";

export class CategoryService {
	async getAll() {
		return prisma.category.findMany({
			orderBy: { order: "asc" },
		});
	}

	async getById(id: string) {
		const cat = await prisma.category.findUnique({ where: { id } });
		if (!cat) throw new Error("NOT_FOUND");
		return cat;
	}

	async create(data: { title?: string; imagePath?: string; order?: number }) {
		const total = await prisma.category.count();

		const order = data.order ?? total + 1;
		const title = data.title ?? "New Category";

		if (order > total + 1) {
			throw new Error("INVALID_ORDER");
		}

		// shift existing items if necessary
		if (order <= total) {
			await prisma.category.updateMany({
				where: { order: { gte: order } },
				data: { order: { increment: 1 } },
			});
		}

		return prisma.category.create({
			data: {
				title,
				imagePath: data.imagePath ?? null,
				order,
			},
		});
	}

	async update(
		id: string,
		data: { title?: string; imagePath?: string; order?: number }
	) {
		const category = await this.getById(id);

		// if ordering changes, adjust neighbors
		if (data.order && data.order !== category.order) {
			const oldOrder = category.order;
			const newOrder = data.order;

			const maxOrder = await prisma.category.count();
			if (newOrder < 1 || newOrder > maxOrder) {
				throw new Error("INVALID_ORDER");
			}

			await prisma.$transaction(async (tx) => {
				if (newOrder < oldOrder) {
					await tx.category.updateMany({
						where: { order: { gte: newOrder, lt: oldOrder } },
						data: { order: { increment: 1 } },
					});
				} else {
					await tx.category.updateMany({
						where: { order: { gt: oldOrder, lte: newOrder } },
						data: { order: { decrement: 1 } },
					});
				}

				await tx.category.update({
					where: { id },
					data: {
						title: data.title ?? undefined,
						imagePath: data.imagePath ?? undefined,
						order: newOrder,
					},
				});
			});
		} else {
			// only updating title/image
			await prisma.category.update({
				where: { id },
				data: {
					title: data.title ?? undefined,
					imagePath: data.imagePath ?? undefined,
				},
			});
		}

		return this.getById(id);
	}

	async delete(id: string) {
		const category = await this.getById(id);

		await prisma.$transaction(async (tx) => {
			await tx.category.delete({ where: { id } });

			// shift down remaining items
			await tx.category.updateMany({
				where: { order: { gt: category.order } },
				data: { order: { decrement: 1 } },
			});
		});

		return { success: true };
	}

	async reorder(items: { id: string; order: number }[]) {
		const existing = await prisma.category.findMany({ select: { id: true } });

		if (existing.length !== items.length) {
			throw new Error("MISMATCH_COUNT");
		}

		const existingIds = new Set(existing.map((x) => x.id));
		const providedIds = new Set(items.map((x) => x.id));

		if (existingIds.size !== providedIds.size) {
			throw new Error("INVALID_IDS");
		}

		const orders = items.map((x) => x.order);
		const uniqueOrders = new Set(orders);

		if (uniqueOrders.size !== orders.length) {
			throw new Error("DUPLICATE_ORDER");
		}

		const max = existing.length;
		for (const o of orders) {
			if (o < 1 || o > max) throw new Error("OUT_OF_RANGE");
		}

		await prisma.$transaction(async (tx) => {
			for (const item of items) {
				await tx.category.update({
					where: { id: item.id },
					data: { order: item.order },
				});
			}
		});

		return prisma.category.findMany({ orderBy: { order: "asc" } });
	}
}

export const categoryService = new CategoryService();
