import apiFetch from "./fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface SubCategory {
	id: string;
	title: string;
	order: number;
	categoryId: string;
	category: {
		id: string;
		title: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CreateSubCategoryData {
	title?: string;
	categoryId: string;
	order?: number;
}

export interface UpdateSubCategoryData {
	title?: string;
	categoryId?: string;
	order?: number;
}

export class SubCategoriesAPI {
	static async getAll(): Promise<SubCategory[]> {
		const response = await apiFetch(`${API_BASE}/admin/subcategories`);
		if (!response.ok) {
			throw new Error("Failed to fetch subcategories");
		}
		return response.json();
	}

	static async getById(id: string): Promise<SubCategory> {
		const response = await apiFetch(`${API_BASE}/subcategories/get/${id}`);
		if (!response.ok) {
			throw new Error("Failed to fetch subcategory");
		}
		return response.json();
	}

	static async create(data: CreateSubCategoryData): Promise<SubCategory> {
		const response = await apiFetch(`${API_BASE}/subcategories/create`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to create subcategory");
		}

		return response.json();
	}

	static async update(
		id: string,
		data: UpdateSubCategoryData
	): Promise<SubCategory> {
		const response = await apiFetch(`${API_BASE}/subcategories/edit/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to update subcategory");
		}

		return response.json();
	}

	static async delete(id: string): Promise<void> {
		const response = await apiFetch(`${API_BASE}/subcategories/delete/${id}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Failed to delete subcategory");
		}
	}
}
