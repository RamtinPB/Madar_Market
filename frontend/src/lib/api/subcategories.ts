import apiFetch from "./fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// ============================================
// TYPE DEFINITIONS
// ============================================

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

export interface ReorderItem {
	id: string;
	order: number;
}

export interface ReorderSubCategoriesData {
	items: ReorderItem[];
}

// ============================================
// ERROR TYPES AND UTILITIES
// ============================================

export class SubCategoriesAPIError extends Error {
	constructor(
		message: string,
		public code?: string,
		public status?: number,
		public details?: any
	) {
		super(message);
		this.name = "SubCategoriesAPIError";
	}
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

function validateCreateData(data: CreateSubCategoryData): ValidationError[] {
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

	if (!data.categoryId || data.categoryId.trim().length === 0) {
		errors.push({
			field: "categoryId",
			message: "Category ID is required",
			code: "CATEGORY_ID_REQUIRED",
		});
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

function validateUpdateData(data: UpdateSubCategoryData): ValidationError[] {
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

	if (data.categoryId !== undefined && data.categoryId !== null) {
		if (!data.categoryId || data.categoryId.trim().length === 0) {
			errors.push({
				field: "categoryId",
				message: "Category ID cannot be empty",
				code: "CATEGORY_ID_INVALID",
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

function validateReorderData(
	data: ReorderSubCategoriesData
): ValidationError[] {
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
): SubCategoriesAPIError {
	const message = getErrorMessage(
		errorData,
		`Failed to ${operation} subcategory`
	);

	switch (status) {
		case 400:
			return new SubCategoriesAPIError(
				message,
				"BAD_REQUEST",
				status,
				errorData?.details
			);
		case 401:
			return new SubCategoriesAPIError(
				"Authentication required. Please log in.",
				"UNAUTHORIZED",
				status,
				errorData
			);
		case 403:
			return new SubCategoriesAPIError(
				"Insufficient permissions. Admin access required.",
				"FORBIDDEN",
				status,
				errorData
			);
		case 404:
			return new SubCategoriesAPIError(
				"Subcategory not found.",
				"NOT_FOUND",
				status,
				errorData
			);
		case 422:
			return new SubCategoriesAPIError(
				message || "Validation failed",
				"VALIDATION_ERROR",
				status,
				errorData?.details
			);
		case 500:
			return new SubCategoriesAPIError(
				"Server error. Please try again later.",
				"SERVER_ERROR",
				status,
				errorData
			);
		default:
			return new SubCategoriesAPIError(
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

export class SubCategoriesAPI {
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
			throw new SubCategoriesAPIError(
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
	 * Get subcategory by ID (admin only)
	 */
	static async getById(id: string): Promise<SubCategory> {
		if (!id || id.trim().length === 0) {
			throw new SubCategoriesAPIError(
				"Subcategory ID is required",
				"INVALID_ID"
			);
		}

		this.setLoading(`getById_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/sub-categories/${id}`);
			return await this.handleResponse<SubCategory>(response, "fetch");
		} finally {
			this.setLoading(`getById_${id}`, false);
		}
	}

	/**
	 * Create a new subcategory
	 */
	static async create(data: CreateSubCategoryData): Promise<SubCategory> {
		const validationErrors = validateCreateData(data);
		if (validationErrors.length > 0) {
			throw new SubCategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		this.setLoading("create", true);
		try {
			const response = await apiFetch(`${API_BASE}/sub-categories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<SubCategory>(response, "create");
		} finally {
			this.setLoading("create", false);
		}
	}

	/**
	 * Update an existing subcategory
	 */
	static async update(
		id: string,
		data: UpdateSubCategoryData
	): Promise<SubCategory> {
		if (!id || id.trim().length === 0) {
			throw new SubCategoriesAPIError(
				"Subcategory ID is required",
				"INVALID_ID"
			);
		}

		const validationErrors = validateUpdateData(data);
		if (validationErrors.length > 0) {
			throw new SubCategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		this.setLoading(`update_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/sub-categories/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<SubCategory>(response, "update");
		} finally {
			this.setLoading(`update_${id}`, false);
		}
	}

	/**
	 * Delete a subcategory
	 */
	static async delete(id: string): Promise<void> {
		if (!id || id.trim().length === 0) {
			throw new SubCategoriesAPIError(
				"Subcategory ID is required",
				"INVALID_ID"
			);
		}

		this.setLoading(`delete_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/sub-categories/${id}`, {
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
	 * Reorder subcategories for a category
	 */
	static async reorder(
		categoryId: string,
		data: ReorderSubCategoriesData
	): Promise<SubCategory[]> {
		if (!categoryId || categoryId.trim().length === 0) {
			throw new SubCategoriesAPIError("Category ID is required", "INVALID_ID");
		}

		const validationErrors = validateReorderData(data);
		if (validationErrors.length > 0) {
			throw new SubCategoriesAPIError(
				"Validation failed",
				"VALIDATION_ERROR",
				422,
				{ details: validationErrors }
			);
		}

		this.setLoading(`reorder_${categoryId}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/sub-categories/reorder/${categoryId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);
			return await this.handleResponse<SubCategory[]>(response, "reorder");
		} finally {
			this.setLoading(`reorder_${categoryId}`, false);
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
}
