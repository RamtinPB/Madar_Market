import { prisma } from "../../infrastructure/db/prisma.client";
import type { CreateProductInput, UpdateProductInput } from "./products.schema";

export const productRepository = {
	// Existing methods
	getSubCatProducts(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
	},

	findProductById(productId: string) {
		return prisma.product.findUnique({
			where: { id: productId },
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
		});
	},

	findSubCatById(subCategoryId: string) {
		return prisma.subCategory.findUnique({
			where: { id: subCategoryId },
		});
	},

	// Product count operations
	async getProductCountBySubCategory(subCategoryId: string) {
		return prisma.product.count({
			where: { subCategoryId },
		});
	},

	// Product CRUD operations
	async createProduct(data: CreateProductInput & { order: number }) {
		return prisma.product.create({
			data: {
				title: data.title ?? "New Product",
				description: data.description,
				price: data.price ?? 0,
				discountPercent: data.discountPercent ?? 0,
				discountedPrice: data.discountedPrice,
				sponsorPrice: data.sponsorPrice,
				subCategoryId: data.subCategoryId,
				order: data.order,
			},
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
		});
	},

	async updateProduct(id: string, data: Partial<UpdateProductInput>) {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.price !== undefined) updateData.price = data.price;
		if (data.discountPercent !== undefined)
			updateData.discountPercent = data.discountPercent;
		if (data.discountedPrice !== undefined)
			updateData.discountedPrice = data.discountedPrice;
		if (data.sponsorPrice !== undefined)
			updateData.sponsorPrice = data.sponsorPrice;
		if (data.subCategoryId !== undefined)
			updateData.subCategoryId = data.subCategoryId;
		if (data.order !== undefined) updateData.order = data.order;

		return prisma.product.update({
			where: { id },
			data: updateData,
		});
	},

	async updateProductsOrder(
		subCategoryId: string,
		order: number,
		increment: boolean
	) {
		return prisma.product.updateMany({
			where: {
				subCategoryId,
				order: increment ? { gte: order } : { gt: order },
			},
			data: {
				order: increment ? { increment: 1 } : { decrement: 1 },
			},
		});
	},

	async updateProductsOrderInRange(
		subCategoryId: string,
		startOrder: number,
		endOrder: number,
		increment: boolean
	) {
		return prisma.product.updateMany({
			where: {
				subCategoryId,
				order: increment
					? { gte: startOrder, lt: endOrder }
					: { gt: startOrder, lte: endOrder },
			},
			data: {
				order: increment ? { increment: 1 } : { decrement: 1 },
			},
		});
	},

	async deleteProduct(id: string) {
		return prisma.product.delete({
			where: { id },
		});
	},

	// Transaction operations
	async updateProductWithTransaction(
		id: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.product.update({
				where: { id },
				data,
			});
		});
	},

	async reorderProductsTransaction(
		items: { id: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			const updatePromises = items.map((item) =>
				tx.product.update({
					where: { id: item.id },
					data: { order: item.order },
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Product attributes operations
	async createAttributes(
		productId: string,
		attributes: Array<{
			title?: string;
			description?: string;
			order?: number;
		}>
	) {
		return prisma.attributes.createMany({
			data: attributes.map((attr, index) => ({
				productId,
				title: attr.title ?? `Attribute ${index + 1}`,
				description: attr.description,
				order: attr.order ?? index + 1,
			})),
		});
	},

	async deleteAttributes(productId: string) {
		return prisma.attributes.deleteMany({
			where: { productId },
		});
	},

	// Product image operations
	async findProductImageById(imageId: string) {
		return prisma.productImage.findUnique({
			where: { id: imageId },
		});
	},

	async findProductImageByFilename(productId: string, filename: string) {
		return prisma.productImage.findFirst({
			where: {
				productId,
				key: {
					contains: `/${productId}/${filename}`,
				},
			},
		});
	},

	async findProductImagesByProduct(productId: string) {
		return prisma.productImage.findMany({
			where: { productId },
			orderBy: { order: "asc" },
		});
	},

	async deleteAllProductImages(productId: string) {
		return prisma.productImage.deleteMany({
			where: { productId },
		});
	},

	async deleteProductImage(imageId: string) {
		return prisma.productImage.delete({
			where: { id: imageId },
		});
	},

	async createProductImages(
		productId: string,
		images: Array<{ key: string; order: number }>
	) {
		return prisma.productImage.createMany({
			data: images.map((img) => ({
				productId,
				key: img.key,
				order: img.order,
			})),
		});
	},

	async updateProductImageOrder(imageId: string, order: number) {
		return prisma.productImage.update({
			where: { id: imageId },
			data: { order },
		});
	},

	async reorderProductImagesTransaction(
		items: { id: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			const updatePromises = items.map((item) =>
				tx.productImage.update({
					where: { id: item.id },
					data: { order: item.order },
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Product reordering operations
	async getProductsBySubCategoryForReorder(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			select: { id: true },
		});
	},

	async getProductsBySubCategoryWithIncludes(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				attributes: {
					orderBy: { order: "asc" },
				},
				images: {
					orderBy: { order: "asc" },
				},
			},
			orderBy: { order: "asc" },
		});
	},

	// Complex transaction operations
	async deleteProductWithTransaction(
		id: string,
		productData: { subCategoryId: string; order: number },
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Delete attributes
			await tx.attributes.deleteMany({
				where: { productId: id },
			});

			// Delete product
			await tx.product.delete({ where: { id } });

			// shift down remaining items in the same subcategory
			await tx.product.updateMany({
				where: {
					subCategoryId: productData.subCategoryId,
					order: { gt: productData.order },
				},
				data: { order: { decrement: 1 } },
			});
		});
	},
};
