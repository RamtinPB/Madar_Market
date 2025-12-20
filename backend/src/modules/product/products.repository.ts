import { prisma } from "../../infrastructure/db/prisma.client";
import type { CreateProductInput, UpdateProductInput } from "./products.schema";

export const productRepository = {
	// Existing methods
	getSubCatProducts(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId: Number(subCategoryId) },
			include: {
				attributes: {
					orderBy: { id: "asc" },
				},
				images: {
					orderBy: { id: "asc" },
				},
			},
			orderBy: { id: "asc" },
		});
	},

	findProductById(productId: string) {
		return prisma.product.findUnique({
			where: { id: Number(productId) },
			include: {
				attributes: {
					orderBy: { id: "asc" },
				},
				images: {
					orderBy: { id: "asc" },
				},
			},
		});
	},

	findSubCatById(subCategoryId: string) {
		return prisma.subCategory.findUnique({
			where: { id: Number(subCategoryId) },
		});
	},

	// Product count operations
	async getProductCountBySubCategory(subCategoryId: string) {
		return prisma.product.count({
			where: { subCategoryId: Number(subCategoryId) },
		});
	},

	// Product CRUD operations
	async createProduct(data: CreateProductInput & { id: number }) {
		return prisma.product.create({
			data: {
				title: data.title ?? "New Product",
				description: data.description,
				price: data.price ?? 0,
				discountPercent: data.discountPercent ?? 0,
				discountedPrice: data.discountedPrice,
				sponsorPrice: data.sponsorPrice,
				subCategoryId: Number(data.subCategoryId),
				id: data.id,
			},
			include: {
				attributes: {
					orderBy: { id: "asc" },
				},
				images: {
					orderBy: { id: "asc" },
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
			updateData.subCategoryId = Number(data.subCategoryId);

		return prisma.product.update({
			where: { id: Number(id) },
			data: updateData,
		});
	},

	async deleteProduct(id: string) {
		return prisma.product.delete({
			where: { id: Number(id) },
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
				where: { id: Number(id) },
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

			// Since we're using ID-based ordering, no actual reordering is needed
			// The frontend can sort by ID when displaying
			const updatePromises = items.map((item) =>
				tx.product.update({
					where: { id: Number(item.id) },
					data: {}, // No data to update since ordering is by ID
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
		}>
	) {
		return prisma.attributes.createMany({
			data: attributes.map((attr, index) => ({
				productId: Number(productId),
				title: attr.title ?? `Attribute ${index + 1}`,
				description: attr.description,
			})),
		});
	},

	async deleteAttributes(productId: string) {
		return prisma.attributes.deleteMany({
			where: { productId: Number(productId) },
		});
	},

	// Product image operations
	async findProductImageById(imageId: string) {
		return prisma.productImage.findUnique({
			where: { id: Number(imageId) },
		});
	},

	async findProductImageByFilename(productId: string, filename: string) {
		return prisma.productImage.findFirst({
			where: {
				productId: Number(productId),
				key: {
					contains: `/${productId}/${filename}`,
				},
			},
		});
	},

	async findProductImagesByProduct(productId: string) {
		return prisma.productImage.findMany({
			where: { productId: Number(productId) },
			orderBy: { id: "asc" },
		});
	},

	async deleteAllProductImages(productId: string) {
		return prisma.productImage.deleteMany({
			where: { productId: Number(productId) },
		});
	},

	async deleteProductImage(imageId: string) {
		return prisma.productImage.delete({
			where: { id: Number(imageId) },
		});
	},

	async createProductImages(productId: string, images: Array<{ key: string }>) {
		return prisma.productImage.createMany({
			data: images.map((img) => ({
				productId: Number(productId),
				key: img.key,
			})),
		});
	},

	async reorderProductImagesTransaction(
		items: { id: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Since we're using ID-based ordering, no actual reordering is needed
			// The frontend can sort by ID when displaying
			const updatePromises = items.map((item) =>
				tx.productImage.update({
					where: { id: Number(item.id) },
					data: {}, // No data to update since ordering is by ID
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Product reordering operations
	async getProductsBySubCategoryForReorder(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId: Number(subCategoryId) },
			select: { id: true },
		});
	},

	async getProductsBySubCategoryWithIncludes(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId: Number(subCategoryId) },
			include: {
				attributes: {
					orderBy: { id: "asc" },
				},
				images: {
					orderBy: { id: "asc" },
				},
			},
			orderBy: { id: "asc" },
		});
	},

	// Complex transaction operations
	async deleteProductWithTransaction(
		id: string,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Delete attributes
			await tx.attributes.deleteMany({
				where: { productId: Number(id) },
			});

			// Delete product
			await tx.product.delete({ where: { id: Number(id) } });
		});
	},
};
