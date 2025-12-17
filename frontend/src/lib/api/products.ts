import apiFetch from "./fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Product {
	id: string;
	title: string;
	description: string;
	price: string;
	discountPercent: string;
	discountedPrice: string;
	sponsorPrice: string;
	order: number;
	subCategoryId: string;
	attributes: ProductAttribute[];
	images: ProductImage[];
	createdAt: string;
	updatedAt: string;
}

export interface ProductAttribute {
	id: string;
	title: string | null;
	description: string | null;
	order: number;
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
	attributes?: ProductAttributeInput[];
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
	attributes?: ProductAttributeInput[];
}

export interface ProductAttributeInput {
	title?: string;
	description?: string;
	order?: number;
}

export interface ReorderItem {
	id: string;
	order: number;
}

export interface ReorderProductsData {
	items: ReorderItem[];
}

export interface ReorderImagesData {
	items: { id: string; order: number }[];
}

// ============================================
// ERROR TYPES AND UTILITIES
// ============================================

export class ProductsAPIError extends Error {
	constructor(
		message: string,
		public code?: string,
		public status?: number,
		public details?: any
	) {
		super(message);
		this.name = "ProductsAPIError";
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

function validateCreateData(data: CreateProductData): ValidationError[] {
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

	if (!data.subCategoryId || data.subCategoryId.trim().length === 0) {
		errors.push({
			field: "subCategoryId",
			message: "Subcategory ID is required",
			code: "SUBCATEGORY_ID_REQUIRED",
		});
	}

	if (data.price !== undefined && data.price !== null) {
		if (typeof data.price !== "number" || data.price < 0) {
			errors.push({
				field: "price",
				message: "Price must be a non-negative number",
				code: "INVALID_PRICE",
			});
		}
	}

	if (data.discountPercent !== undefined && data.discountPercent !== null) {
		if (
			typeof data.discountPercent !== "number" ||
			data.discountPercent < 0 ||
			data.discountPercent > 100
		) {
			errors.push({
				field: "discountPercent",
				message: "Discount percent must be between 0 and 100",
				code: "INVALID_DISCOUNT_PERCENT",
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

function validateUpdateData(data: UpdateProductData): ValidationError[] {
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

	if (data.subCategoryId !== undefined && data.subCategoryId !== null) {
		if (!data.subCategoryId || data.subCategoryId.trim().length === 0) {
			errors.push({
				field: "subCategoryId",
				message: "Subcategory ID cannot be empty",
				code: "SUBCATEGORY_ID_INVALID",
			});
		}
	}

	if (data.price !== undefined && data.price !== null) {
		if (typeof data.price !== "number" || data.price < 0) {
			errors.push({
				field: "price",
				message: "Price must be a non-negative number",
				code: "INVALID_PRICE",
			});
		}
	}

	if (data.discountPercent !== undefined && data.discountPercent !== null) {
		if (
			typeof data.discountPercent !== "number" ||
			data.discountPercent < 0 ||
			data.discountPercent > 100
		) {
			errors.push({
				field: "discountPercent",
				message: "Discount percent must be between 0 and 100",
				code: "INVALID_DISCOUNT_PERCENT",
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

function validateReorderData(data: ReorderProductsData): ValidationError[] {
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

function validateReorderImagesData(data: ReorderImagesData): ValidationError[] {
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
): ProductsAPIError {
	const message = getErrorMessage(errorData, `Failed to ${operation} product`);

	switch (status) {
		case 400:
			return new ProductsAPIError(
				message,
				"BAD_REQUEST",
				status,
				errorData?.details
			);
		case 401:
			return new ProductsAPIError(
				"Authentication required. Please log in.",
				"UNAUTHORIZED",
				status,
				errorData
			);
		case 403:
			return new ProductsAPIError(
				"Insufficient permissions. Admin access required.",
				"FORBIDDEN",
				status,
				errorData
			);
		case 404:
			return new ProductsAPIError(
				"Product not found.",
				"NOT_FOUND",
				status,
				errorData
			);
		case 422:
			return new ProductsAPIError(
				message || "Validation failed",
				"VALIDATION_ERROR",
				status,
				errorData?.details
			);
		case 500:
			return new ProductsAPIError(
				"Server error. Please try again later.",
				"SERVER_ERROR",
				status,
				errorData
			);
		default:
			return new ProductsAPIError(
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

export class ProductsAPI {
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
			throw new ProductsAPIError(
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
	 * Get product by ID (admin only)
	 */
	static async getById(id: string): Promise<Product> {
		if (!id || id.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		this.setLoading(`getById_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/products/${id}`);
			return await this.handleResponse<Product>(response, "fetch");
		} finally {
			this.setLoading(`getById_${id}`, false);
		}
	}

	/**
	 * Get all products for a subcategory (public)
	 */
	static async getAllBySubCategory(subCategoryId: string): Promise<Product[]> {
		if (!subCategoryId || subCategoryId.trim().length === 0) {
			throw new ProductsAPIError("Subcategory ID is required", "INVALID_ID");
		}

		this.setLoading(`getAllBySubCategory_${subCategoryId}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/sub-categories/${subCategoryId}/products`
			);
			return await this.handleResponse<Product[]>(response, "fetch products");
		} finally {
			this.setLoading(`getAllBySubCategory_${subCategoryId}`, false);
		}
	}

	/**
	 * Create a new product
	 */
	static async create(data: CreateProductData): Promise<Product> {
		const validationErrors = validateCreateData(data);
		if (validationErrors.length > 0) {
			throw new ProductsAPIError("Validation failed", "VALIDATION_ERROR", 422, {
				details: validationErrors,
			});
		}

		this.setLoading("create", true);
		try {
			const response = await apiFetch(`${API_BASE}/products`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<Product>(response, "create");
		} finally {
			this.setLoading("create", false);
		}
	}

	/**
	 * Update an existing product
	 */
	static async update(id: string, data: UpdateProductData): Promise<Product> {
		if (!id || id.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		const validationErrors = validateUpdateData(data);
		if (validationErrors.length > 0) {
			throw new ProductsAPIError("Validation failed", "VALIDATION_ERROR", 422, {
				details: validationErrors,
			});
		}

		this.setLoading(`update_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/products/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await this.handleResponse<Product>(response, "update");
		} finally {
			this.setLoading(`update_${id}`, false);
		}
	}

	/**
	 * Delete a product
	 */
	static async delete(id: string): Promise<void> {
		if (!id || id.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		this.setLoading(`delete_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/products/${id}`, {
				method: "DELETE",
			});
			await this.handleResponse<void>(response, "delete");
		} finally {
			this.setLoading(`delete_${id}`, false);
		}
	}

	// ============================================
	// PRODUCT IMAGE MANAGEMENT
	// ============================================

	/**
	 * Upload/replace product images
	 */
	static async uploadImages(id: string, images: File[]): Promise<Product> {
		if (!id || id.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		if (!images || images.length === 0) {
			throw new ProductsAPIError(
				"At least one image is required",
				"IMAGES_REQUIRED"
			);
		}

		this.setLoading(`uploadImages_${id}`, true);
		try {
			const formData = new FormData();
			images.forEach((image) => {
				formData.append("images", image);
			});

			const response = await apiFetch(`${API_BASE}/products/${id}/images`, {
				method: "PUT",
				body: formData,
			});

			return await this.handleResponse<Product>(response, "upload images");
		} finally {
			this.setLoading(`uploadImages_${id}`, false);
		}
	}

	/**
	 * Delete specific product image by ID
	 */
	static async deleteImage(
		productId: string,
		imageId: string
	): Promise<Product> {
		if (!productId || productId.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		if (!imageId || imageId.trim().length === 0) {
			throw new ProductsAPIError("Image ID is required", "INVALID_IMAGE_ID");
		}

		this.setLoading(`deleteImage_${productId}_${imageId}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/products/${productId}/images/${imageId}`,
				{
					method: "DELETE",
				}
			);
			return await this.handleResponse<Product>(response, "delete image");
		} finally {
			this.setLoading(`deleteImage_${productId}_${imageId}`, false);
		}
	}

	/**
	 * Reorder product images
	 */
	static async reorderImages(
		productId: string,
		data: ReorderImagesData
	): Promise<Product> {
		if (!productId || productId.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		const validationErrors = validateReorderImagesData(data);
		if (validationErrors.length > 0) {
			throw new ProductsAPIError("Validation failed", "VALIDATION_ERROR", 422, {
				details: validationErrors,
			});
		}

		this.setLoading(`reorderImages_${productId}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/products/${productId}/images/reorder`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);
			return await this.handleResponse<Product>(response, "reorder images");
		} finally {
			this.setLoading(`reorderImages_${productId}`, false);
		}
	}

	/**
	 * Get product image upload URL
	 */
	static async getImageUploadUrl(
		id: string
	): Promise<{ uploadUrl: string; imageUrl: string }> {
		if (!id || id.trim().length === 0) {
			throw new ProductsAPIError("Product ID is required", "INVALID_ID");
		}

		this.setLoading(`getImageUploadUrl_${id}`, true);
		try {
			const response = await apiFetch(`${API_BASE}/products/${id}/upload-url`);
			return await this.handleResponse<{ uploadUrl: string; imageUrl: string }>(
				response,
				"get image upload URL"
			);
		} finally {
			this.setLoading(`getImageUploadUrl_${id}`, false);
		}
	}

	// ============================================
	// ADDITIONAL OPERATIONS
	// ============================================

	/**
	 * Reorder products for a subcategory
	 */
	static async reorder(
		subCategoryId: string,
		data: ReorderProductsData
	): Promise<Product[]> {
		if (!subCategoryId || subCategoryId.trim().length === 0) {
			throw new ProductsAPIError("Subcategory ID is required", "INVALID_ID");
		}

		const validationErrors = validateReorderData(data);
		if (validationErrors.length > 0) {
			throw new ProductsAPIError("Validation failed", "VALIDATION_ERROR", 422, {
				details: validationErrors,
			});
		}

		this.setLoading(`reorder_${subCategoryId}`, true);
		try {
			const response = await apiFetch(
				`${API_BASE}/products/reorder/${subCategoryId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);
			return await this.handleResponse<Product[]>(response, "reorder");
		} finally {
			this.setLoading(`reorder_${subCategoryId}`, false);
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
