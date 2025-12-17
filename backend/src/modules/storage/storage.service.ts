import {
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../s3";
import { ValidationError } from "../../utils/errors";

export interface ImageValidationOptions {
	maxSize?: number; // in bytes
	allowedTypes?: string[];
}

export class StorageService {
	private bucketName = process.env.ARVAN_BUCKET_NAME!;
	private defaultValidationOptions: ImageValidationOptions = {
		maxSize: 5 * 1024 * 1024, // 5MB
		allowedTypes: ["image/jpeg", "image/png", "image/webp"],
	};

	validateImage(file: File, options?: ImageValidationOptions): void {
		const opts = { ...this.defaultValidationOptions, ...options };
		if (opts.maxSize && file.size > opts.maxSize) {
			throw new ValidationError(`File size exceeds ${opts.maxSize} bytes`);
		}
		if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
			throw new ValidationError(
				`File type ${
					file.type
				} not allowed. Allowed types: ${opts.allowedTypes.join(", ")}`
			);
		}
	}

	async getUploadUrl(
		key: string,
		contentType: string,
		expiresIn: number = 300
	): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			ContentType: contentType,
		});
		return await getSignedUrl(s3, command, { expiresIn });
	}

	async getRetrievalUrl(
		key: string,
		expiresIn: number = 3600
	): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});
		return await getSignedUrl(s3, command, { expiresIn });
	}

	async deleteObject(key: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});
		await s3.send(command);
	}

	async uploadFile(
		key: string,
		file: File,
		contentType?: string
	): Promise<void> {
		const buffer = Buffer.from(await file.arrayBuffer());
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			Body: buffer,
			ContentType: contentType || file.type,
		});
		await s3.send(command);
	}

	getPublicUrl(key: string): string {
		return `${process.env.ARVAN_ENDPOINT}/${key}`;
	}

	// Helper method to generate key for category images
	generateCategoryImageKey(categoryId: string, filename: string): string {
		return `uploads/categories/${categoryId}/${filename}`;
	}

	// Helper method to generate key for product images
	generateProductImageKey(productId: string, filename: string): string {
		return `uploads/products/${productId}/${filename}`;
	}
}

export const storageService = new StorageService();
