// src/modules/product/products.service.ts
import { prisma } from "../../utils/prisma";

export class ProductService {
	async getAllBySubCategory(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				images: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
	}
}

export const productService = new ProductService();
