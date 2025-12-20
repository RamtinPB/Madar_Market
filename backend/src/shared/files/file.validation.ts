import { extname } from "path";
// Extract extension from file
export function getFileExtension(file: File): string {
	return extname(file.name).toLowerCase();
}

// Verify mime type
export function verifyMimeType(file: File, allowedTypes: string[]): boolean {
	return allowedTypes.includes(file.type);
}
