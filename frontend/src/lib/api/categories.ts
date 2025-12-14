import apiFetch from "./fetcher";
import { SubCategory } from "./subcategories";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface Category {
	id: string;
	title: string;
	order: number;
	imagePath: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCategoryData {
	title?: string;
	order?: number;
	image?: File;
}

export interface UpdateCategoryData {
	title?: string;
	order?: number;
}

export class CategoriesAPI {
	static async getAll(): Promise<Category[]> {
		const response = await apiFetch(`${API_BASE}/categories/get-all`);
		if (!response.ok) {
			throw new Error("Failed to fetch categories");
		}
		return response.json();
	}

	static async getById(id: string): Promise<Category> {
		const response = await apiFetch(`${API_BASE}/categories/get/${id}`);
		if (!response.ok) {
			throw new Error("Failed to fetch category");
		}
		return response.json();
	}

	static async create(data: CreateCategoryData): Promise<Category> {
		const formData = new FormData();

		if (data.title) formData.append("title", data.title);
		if (data.order !== undefined)
			formData.append("order", data.order.toString());
		if (data.image) formData.append("image", data.image);

		const response = await apiFetch(`${API_BASE}/categories/create`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to create category");
		}

		return response.json();
	}

	static async update(id: string, data: UpdateCategoryData): Promise<Category> {
		const response = await apiFetch(`${API_BASE}/categories/edit/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to update category");
		}

		return response.json();
	}

	static async delete(id: string): Promise<void> {
		const response = await apiFetch(`${API_BASE}/categories/delete/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to delete category");
		}
	}

	static async uploadImage(id: string, image: File): Promise<Category> {
		const formData = new FormData();
		formData.append("image", image);

		const response = await apiFetch(
			`${API_BASE}/categories/upload-image/${id}`,
			{
				method: "PUT",
				body: formData,
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to upload image");
		}

		return response.json();
	}

	static async getSubcategoriesByCategory(
		categoryId: string
	): Promise<SubCategory[]> {
		const response = await apiFetch(
			`${API_BASE}/categories/${categoryId}/get-all-subcategories`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch subcategories for category");
		}
		return response.json();
	}
}
