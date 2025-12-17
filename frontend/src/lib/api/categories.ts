import apiFetch from "./fetcher";
import { SubCategory } from "./subcategories";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// ============================================
// TYPE DEFINITIONS
// ============================================

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
}

export interface UpdateCategoryData {
	title?: string;
	order?: number;
}

export interface ReorderItem {
	id: string;
	order: number;
}

export interface ReorderCategoriesData {
	items: ReorderItem[];
}

export interface ImageUploadUrlResponse {
	uploadUrl: string;
	imageUrl: string;
}

// ============================================
// ERROR TYPES AND UTILITIES
// ============================================

export class CategoriesAPIError extends Error {
	constructor(
		message: string,
		public code?: string,
		public status?: number,
		public details?: any
	) {
		super(message);
		this.name = "CategoriesAPIError";
	}
}

export interface APIResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
	details?: any;
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

function validateCreateData(data: CreateCategoryData): ValidationError[] {
	const errors: ValidationError[] = [];

	if (data.title !== undefined) {
		if (!data.title || data.title.trim().length === 0) {
			errors.push({
				field: "title",
				message: "Title cannot be empty",
				code: "TITLE_REQUIRED",
			});
		} else if (data.title.length < 2) {
			errors.push({
				field: "title",
				message: "Title must be at least 2 characters long",
				code: "TITLE_TOO_SHORT",
			});
		}
	}

	if (data.order !== undefined && data.order !== null) {
		if (
			typeof data.order !== "number" ||
			!Number.isInteger(data.order) ||
			data.order < 1
		) {
			errors.push({
				field: "order",
				message: "Order must be a positive integer",
				code: "INVALID_ORDER",
			});
		}
	}

	return errors;
}

function validateUpdateData(data: UpdateCategoryData): ValidationError[] {
	const errors: ValidationError[] = [];

	if (data.title !== undefined) {
		if (!data.title || data.title.trim().length === 0) {
			errors.push({
				field: "title",
				message: "Title cannot be empty",
				code: "TITLE_REQUIRED",
			});
		} else if (data.title.length < 2) {
			errors.push({
				field: "title",
				message: "Title must be at least 2 characters long",
				code: "TITLE_TOO_SHORT",
			});
		}
	}

	if (data.order !== undefined && data.order !== null) {
		if (
			typeof data.order !== "number" ||
			!Number.isInteger(data.order) ||
			data.order < 1
		) {
			errors.push({
				field: "order",
				message: "Order must be a positive integer",
				code: "INVALID_ORDER",
			});
		}
	}

	return errors;
}

function validateReorderData(data: ReorderCategoriesData): ValidationError[] {
	const errors: ValidationError[] = [];

	if (!data.items || !Array.isArray(data.items)) {
		errors.push({
			field: "items",
			message: "Items array is required",
			code: "ITEMS_REQUIRED",
		});
		return errors;
	}

	data.items.forEach((item, index) => {
		if (!item.id || item.id.trim().length === 0) {
			errors.push({
				field: `items[${index}].id`,
				message: "Item ID is required",
				code: "ITEM_ID_REQUIRED",
			});
		}

		if (
			typeof item.order !== "number" ||
			!Number.isInteger(item.order) ||
			item.order < 1
		) {
			errors.push({
				field: `items[${index}].order`,
				message: "Item order must be a positive integer",
				code: "INVALID_ITEM_ORDER",
			});
		}
	});

	return errors;
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

function getErrorMessage(error: any, fallback: string): string {
	if (typeof error === "string") return error;
	if (error?.message) return error.message;
	if (error?.error) return error.error;
	if (error?.details?.message) return error.details.message;
	return fallback;
}

function createAPIError(
	status: number,
	errorData: any,
	operation: string
): CategoriesAPIError {
	const message = getErrorMessage(errorData, `Failed to ${operation} category`);

	switch (status) {
		case 400:
			return new CategoriesAPIError(
				message,
				"BAD_REQUEST",
				status,
				errorData?.details
			);
		case 401:
			return new CategoriesAPIError(
				"Authentication required. Please log in.",
				"UNAUTHORIZED",
				status,
				errorData
			);
		case 403:
			return new CategoriesAPIError(
				"Insufficient permissions. Admin access required.",
				"FORBIDDEN",
				status,
				errorData
			);
		case 404:
			return new CategoriesAPIError(
				"Category not found.",
				"NOT_FOUND",
				status,
				errorData
			);
		case 422:
			return new CategoriesAPIError(
				message || "Validation failed",
				"VALIDATION_ERROR",
				status,
				errorData?.details
			);
		case 500:
			return new CategoriesAPIError(
				"Server error. Please try again later.",
				"SERVER_ERROR",
				status,
				errorData
			);
		default:
			return new CategoriesAPIError(
				message || `HTTP ${status} error`,
				"HTTP_ERROR",
				status,
				errorData
			);
	}
}

// ============================================
// LOADING STATE MANAGEMENT
// ============================================

class LoadingStateManager {
	private states = new Map<string, boolean>();
	private callbacks = new Set<() => void>();

	setLoading(operation: string, loading: boolean) {
		this.states.set(operation, loading);
		this.notifyCallbacks();
	}

	isLoading(operation?: string): boolean {
		if (operation) {
			return this.states.get(operation) || false;
		}
		return Array.from(this.states.values()).some(Boolean);
	}

	onChange(callback: () => void) {
		this.callbacks.add(callback);
		return () => this.callbacks.delete(callback);
	}

	private notifyCallbacks() {
		this.callbacks.forEach((callback) => callback());
	}
}

const loadingStateManager = new LoadingStateManager();

// ============================================
// MAIN API CLASS
// ============================================

export class CategoriesAPI {
	// ============================================
	// UTILITY METHODS
	// ============================================

	private static async handleResponse<T>(
		response: Response,
		operation: string
	): Promise<T> {
		if (!response.ok) {
			let errorData: any;
			try {
				errorData = await response.json();
			} catch {
				errorData = { error: `HTTP ${response.status}` };
			}
			throw createAPIError(response.status, errorData, operation);
		}

		try {
			return await response.json();
		} catch (error) {
			throw new CategoriesAPIError(
				"Invalid response format",
				"INVALID_RESPONSE",
				response.status,
				error
			);
		}
	}

	private static setLoading(operation: string, loading: boolean) {
		loadingStateManager.setLoading(operation, loading);
	}

	// ============================================
	// CRUD OPERATIONS
	// ============================================

	/**
	 * Get all categories (public)
	 */
	static async getAll(): Promise<Category[]> {
		this.setLoading("getAll", true);
		try {
			const response = await apiFetch(`${API_BASE}/categories`);
			return await this.handleResponse<Category[]>(response, "fetch");
		} finally {
			this.setLoading("getAll", false);
		}
	}

	/**
	 * Get category by ID (public)
	 */
	static async getById(id: string): Promise<Category> {
		if (!id || id.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		this.setLoading(`getById_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/categories/${id}`);
			return await this.handleResponse<Category>(response, "fetch");
		} finally {
			this.setLoading(`getById_${id}`, false);
		}
	}

	/**
	 * Create a new category (admin only)
	 */
	static async create(data: CreateCategoryData): Promise<Category> {
		const validationErrors = validateCreateData(data);
		if (validationErrors.length > 0) {
			throw new CategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		this.setLoading("create", true);
		try {
			const response = await apiFetch(`${API_BASE}/categories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<Category>(response, "create");
		} finally {
			this.setLoading("create", false);
		}
	}

	/**
	 * Update an existing category (admin only)
	 */
	static async update(id: string, data: UpdateCategoryData): Promise<Category> {
		if (!id || id.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		const validationErrors = validateUpdateData(data);
		if (validationErrors.length > 0) {
			throw new CategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		this.setLoading(`update_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/categories/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<Category>(response, "update");
		} finally {
			this.setLoading(`update_${id}`, false);
		}
	}

	/**
	 * Delete a category (admin only)
	 */
	static async delete(id: string): Promise<void> {
		if (!id || id.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		this.setLoading(`delete_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/categories/${id}`, {
				method: "DELETE",
			});
			await this.handleResponse<void>(response, "delete");
		} finally {
			this.setLoading(`delete_${id}`, false);
		}
	}

	// ============================================
	// ADDITIONAL OPERATIONS
	// ============================================

	/**
	 * Get subcategories for a category
	 */
	static async getSubcategoriesByCategory(
		categoryId: string
	): Promise<SubCategory[]> {
		if (!categoryId || categoryId.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		this.setLoading(`getSubcategories_${categoryId}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/categories/${categoryId}/subcategories`
			);
			return await this.handleResponse<SubCategory[]>(
				response,
				"fetch subcategories"
			);
		} finally {
			this.setLoading(`getSubcategories_${categoryId}`, false);
		}
	}

	/**
	 * Reorder categories
	 */
	static async reorder(data: ReorderCategoriesData): Promise<Category[]> {
		const validationErrors = validateReorderData(data);
		if (validationErrors.length > 0) {
			throw new CategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		this.setLoading("reorder", true);
		try {
			const response = await apiFetch(`${API_BASE}/categories/reorder`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<Category[]>(response, "reorder");
		} finally {
			this.setLoading("reorder", false);
		}
	}

	/**
	 * Get category image upload URL
	 */
	static async getImageUploadUrl(id: string): Promise<ImageUploadUrlResponse> {
		if (!id || id.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		this.setLoading(`getImageUploadUrl_${id}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/categories/${id}/image-upload-url`,
				{
					method: "POST",
				}
			);
			return await this.handleResponse<ImageUploadUrlResponse>(
				response,
				"get image upload URL"
			);
		} finally {
			this.setLoading(`getImageUploadUrl_${id}`, false);
		}
	}

	/**
	 * Delete category image
	 */
	static async deleteImage(id: string): Promise<void> {
		if (!id || id.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		this.setLoading(`deleteImage_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/categories/${id}/image`, {
				method: "DELETE",
			});
			await this.handleResponse<void>(response, "delete image");
		} finally {
			this.setLoading(`deleteImage_${id}`, false);
		}
	}

	// ============================================
	// OPTIMISTIC UPDATE SUPPORT
	// ============================================

	/**
	 * Create category with optimistic update support
	 */
	static async createOptimistic(
		data: CreateCategoryData,
		onOptimisticUpdate: (optimisticData: Category) => void,
		onRollback: () => void
	): Promise<Category> {
		const validationErrors = validateCreateData(data);
		if (validationErrors.length > 0) {
			throw new CategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		// Create optimistic category
		const optimisticCategory: Category = {
			id: `temp_${Date.now()}`, // Temporary ID
			title: data.title || "",
			order: data.order || 1,
			imagePath: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		try {
			// Apply optimistic update
			onOptimisticUpdate(optimisticCategory);

			// Perform actual API call
			const response = await apiFetch(`${API_BASE}/categories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const realCategory = await this.handleResponse<Category>(
				response,
				"create"
			);

			// Return the real category (optimistic update will be replaced)
			return realCategory;
		} catch (error) {
			// Rollback optimistic update on error
			onRollback();
			throw error;
		}
	}

	/**
	 * Update category with optimistic update support
	 */
	static async updateOptimistic(
		id: string,
		data: UpdateCategoryData,
		previousData: Category,
		onOptimisticUpdate: (optimisticData: Category) => void,
		onRollback: () => void
	): Promise<Category> {
		if (!id || id.trim().length === 0) {
			throw new CategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		const validationErrors = validateUpdateData(data);
		if (validationErrors.length > 0) {
			throw new CategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		// Create optimistic category
		const optimisticCategory: Category = {
			...previousData,
			...data,
			updatedAt: new Date().toISOString(),
		};

		try {
			// Apply optimistic update
			onOptimisticUpdate(optimisticCategory);

			// Perform actual API call
			const response = await apiFetch(`${API_BASE}/categories/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const realCategory = await this.handleResponse<Category>(
				response,
				"update"
			);

			// Return the real category
			return realCategory;
		} catch (error) {
			// Rollback optimistic update on error
			onRollback();
			throw error;
		}
	}

	// ============================================
	// LOADING STATE UTILITIES
	// ============================================

	/**
	 * Check if any operation is loading
	 */
	static isLoading(): boolean {
		return loadingStateManager.isLoading();
	}

	/**
	 * Check if specific operation is loading
	 */
	static isOperationLoading(operation: string): boolean {
		return loadingStateManager.isLoading(operation);
	}

	/**
	 * Subscribe to loading state changes
	 */
	static onLoadingStateChange(callback: () => void): () => void {
		return loadingStateManager.onChange(callback);
	}

	// ============================================
	// BATCH OPERATIONS
	// ============================================

	/**
	 * Batch create multiple categories
	 */
	static async batchCreate(
		categories: CreateCategoryData[]
	): Promise<Category[]> {
		const results: Category[] = [];
		const errors: any[] = [];

		for (let i = 0; i < categories.length; i++) {
			try {
				const category = await this.create(categories[i]);
				results.push(category);
			} catch (error) {
				errors.push({
					index: i,
					data: categories[i],
					error: error,
				});
			}
		}

		if (errors.length > 0) {
			throw new CategoriesAPIError(
				`Failed to create ${errors.length} out of ${categories.length} categories`,
				"BATCH_ERROR",
				207, // Multi-Status
				{ errors, successful: results }
			);
		}

		return results;
	}

	/**
	 * Batch delete multiple categories
	 */
	static async batchDelete(ids: string[]): Promise<void> {
		const errors: any[] = [];

		for (let i = 0; i < ids.length; i++) {
			try {
				await this.delete(ids[i]);
			} catch (error) {
				errors.push({
					index: i,
					id: ids[i],
					error: error,
				});
			}
		}

		if (errors.length > 0) {
			throw new CategoriesAPIError(
				`Failed to delete ${errors.length} out of ${ids.length} categories`,
				"BATCH_ERROR",
				207, // Multi-Status
				{ errors }
			);
		}
	}
}

// ============================================
// EXPORT UTILITIES
// ============================================

export default CategoriesAPI;
