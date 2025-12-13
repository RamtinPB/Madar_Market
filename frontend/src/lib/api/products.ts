import apiFetch from "./fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface Product {
	id: string;
	title: string;
	description: string | null;
	price: string;
	discountPercent: number;
	discountedPrice: string | null;
	sponsorPrice: string | null;
	order: number;
	subCategoryId: string;
	images: ProductImage[];
	createdAt: string;
	updatedAt: string;
}

export interface ProductImage {
	id: string;
	path: string;
	order: number;
}

export interface CreateProductData {
	title?: string;
	description?: string;
	price?: number;
	discountPercent?: number;
	discountedPrice?: number;
	sponsorPrice?: number;
	order?: number;
	subCategoryId: string;
	images?: File[];
}

export interface UpdateProductData {
	title?: string;
	description?: string;
	price?: number;
	discountPercent?: number;
	discountedPrice?: number;
	sponsorPrice?: number;
	order?: number;
	subCategoryId?: string;
}

export interface UploadImagesData {
	images: File[];
}

export interface ReorderImagesData {
	items: { id: string; order: number }[];
}

export class ProductsAPI {
	static async getById(id: string): Promise<Product> {
		const response = await apiFetch(`${API_BASE}/products/get/${id}`);
		if (!response.ok) {
			throw new Error("Failed to fetch product");
		}
		return response.json();
	}

	static async getAllBySubCategory(subCategoryId: string): Promise<Product[]> {
		const response = await apiFetch(
			`${API_BASE}/subcategories/${subCategoryId}/get-all-products`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch products");
		}
		return response.json();
	}

	static async create(data: CreateProductData): Promise<Product> {
		const formData = new FormData();

		// Add basic fields
		if (data.title) formData.append("title", data.title);
		if (data.description) formData.append("description", data.description);
		if (data.price !== undefined)
			formData.append("price", data.price.toString());
		if (data.discountPercent !== undefined)
			formData.append("discountPercent", data.discountPercent.toString());
		if (data.discountedPrice !== undefined)
			formData.append("discountedPrice", data.discountedPrice.toString());
		if (data.sponsorPrice !== undefined)
			formData.append("sponsorPrice", data.sponsorPrice.toString());
		if (data.order !== undefined)
			formData.append("order", data.order.toString());
		formData.append("subCategoryId", data.subCategoryId);

		// Add images if provided
		if (data.images && data.images.length > 0) {
			data.images.forEach((image, index) => {
				formData.append("images", image);
			});
		}

		const response = await apiFetch(`${API_BASE}/products/create`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to create product");
		}

		return response.json();
	}

	static async update(id: string, data: UpdateProductData): Promise<Product> {
		const response = await apiFetch(`${API_BASE}/products/edit/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to update product");
		}

		return response.json();
	}

	static async delete(id: string): Promise<void> {
		const response = await apiFetch(`${API_BASE}/products/delete/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to delete product");
		}
	}

	static async uploadImages(id: string, images: File[]): Promise<Product> {
		const formData = new FormData();
		images.forEach((image) => {
			formData.append("images", image);
		});

		const response = await apiFetch(
			`${API_BASE}/products/upload-images/${id}`,
			{
				method: "PUT",
				body: formData,
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to upload images");
		}

		return response.json();
	}

	static async deleteImage(
		productId: string,
		imageId: string
	): Promise<Product> {
		const response = await apiFetch(
			`${API_BASE}/products/delete-image/${productId}/${imageId}`,
			{
				method: "DELETE",
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to delete image");
		}

		return response.json();
	}

	static async reorderImages(
		productId: string,
		items: { id: string; order: number }[]
	): Promise<Product> {
		const response = await apiFetch(
			`${API_BASE}/products/reorder-images/${productId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ items }),
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to reorder images");
		}

		return response.json();
	}
}
