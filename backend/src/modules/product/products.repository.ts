import { prisma } from "../../infrastructure/db/prisma.client";
import type { CreateProductInput, UpdateProductInput } from "./products.schema";

export const productRepository = {
	// Existing methods
	getSubCatProducts(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				attributes: {
					orderBy: { businessId: "asc" },
				},
				images: {
					orderBy: { businessId: "asc" },
				},
			},
			orderBy: { businessId: "asc" },
		});
	},

	findProductById(productId: string) {
		return prisma.product.findUnique({
			where: { businessId: productId },
			include: {
				attributes: {
					orderBy: { businessId: "asc" },
				},
				images: {
					orderBy: { businessId: "asc" },
				},
			},
		});
	},

	findSubCatById(subCategoryId: string) {
		return prisma.subCategory.findUnique({
			where: { businessId: subCategoryId },
		});
	},

	// Product count operations
	async getProductCountBySubCategory(subCategoryId: string) {
		return prisma.product.count({
			where: { subCategoryId },
		});
	},

	// Product CRUD operations
	async createProduct(data: CreateProductInput) {
		return prisma.product.create({
			data: {
				title: data.title ?? "New Product",
				description: data.description,
				price: data.price ?? 0,
				discountPercent: data.discountPercent ?? 0,
				discountedPrice: data.discountedPrice,
				sponsorPrice: data.sponsorPrice,
				subCategoryId: data.subCategoryId,
			},
			include: {
				attributes: {
					orderBy: { businessId: "asc" },
				},
				images: {
					orderBy: { businessId: "asc" },
				},
			},
		});
	},

	async updateProduct(businessId: string, data: Partial<UpdateProductInput>) {
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

		return prisma.product.update({
			where: { businessId },
			data: updateData,
		});
	},

	async deleteProduct(businessId: string) {
		return prisma.product.delete({
			where: { businessId },
		});
	},

	// Transaction operations
	async updateProductWithTransaction(
		businessId: string,
		data: any,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			return tx.product.update({
				where: { businessId },
				data,
			});
		});
	},

	async reorderProductsTransaction(
		items: { businessId: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Since we're using businessId-based ordering, no actual reordering is needed
			// The frontend can sort by businessId when displaying
			const updatePromises = items.map((item) =>
				tx.product.update({
					where: { businessId: item.businessId },
					data: {}, // No data to update since ordering is by businessId
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
				productId,
				title: attr.title ?? `Attribute ${index + 1}`,
				description: attr.description,
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
			where: { businessId: imageId },
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
			orderBy: { businessId: "asc" },
		});
	},

	async deleteAllProductImages(productId: string) {
		return prisma.productImage.deleteMany({
			where: { productId },
		});
	},

	async deleteProductImage(imageId: string) {
		return prisma.productImage.delete({
			where: { businessId: imageId },
		});
	},

	async createProductImages(productId: string, images: Array<{ key: string }>) {
		return prisma.productImage.createMany({
			data: images.map((img) => ({
				productId,
				key: img.key,
			})),
		});
	},

	async reorderProductImagesTransaction(
		items: { businessId: string; order: number }[],
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Since we're using businessId-based ordering, no actual reordering is needed
			// The frontend can sort by businessId when displaying
			const updatePromises = items.map((item) =>
				tx.productImage.update({
					where: { businessId: item.businessId },
					data: {}, // No data to update since ordering is by businessId
				})
			);

			await Promise.all(updatePromises);
		});
	},

	// Product reordering operations
	async getProductsBySubCategoryForReorder(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			select: { businessId: true },
		});
	},

	async getProductsBySubCategoryWithIncludes(subCategoryId: string) {
		return prisma.product.findMany({
			where: { subCategoryId },
			include: {
				attributes: {
					orderBy: { businessId: "asc" },
				},
				images: {
					orderBy: { businessId: "asc" },
				},
			},
			orderBy: { businessId: "asc" },
		});
	},

	// Complex transaction operations
	async deleteProductWithTransaction(
		businessId: string,
		transactionCallback: (tx: any) => Promise<void>
	) {
		return prisma.$transaction(async (tx) => {
			await transactionCallback(tx);

			// Delete attributes
			await tx.attributes.deleteMany({
				where: { productId: businessId },
			});

			// Delete product
			await tx.product.delete({ where: { businessId } });
		});
	},
};
