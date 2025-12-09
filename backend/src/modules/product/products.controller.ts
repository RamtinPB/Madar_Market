// src/modules/product/products.controller.ts
import { productService } from "./products.service";

export class ProductController {
	async getAllBySubCategory(ctx: any) {
		const { subCategoryId } = ctx.params;
		return await productService.getAllBySubCategory(subCategoryId);
	}
}

export const productController = new ProductController();
