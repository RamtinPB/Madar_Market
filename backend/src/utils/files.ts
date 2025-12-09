import { mkdir, writeFile, unlink } from "fs/promises";
import { join, extname } from "path";
import { createId } from "@paralleldrive/cuid2";

// Ensure the folder exists
export async function ensureFolderExists(path: string): Promise<void> {
	try {
		await mkdir(path, { recursive: true });
	} catch (error) {
		// Ignore if already exists
	}
}

// Save uploaded file
export async function saveUploadedFile(
	file: File,
	targetFolder: string,
	targetName?: string
): Promise<string> {
	// Ensure folder exists
	await ensureFolderExists(targetFolder);

	// Generate filename if not provided
	const filename = targetName || `${createId()}${extname(file.name)}`;
	const filePath = join(targetFolder, filename);

	// Convert File to Buffer
	const buffer = Buffer.from(await file.arrayBuffer());

	// Write file
	await writeFile(filePath, buffer);

	// Return relative path (assuming targetFolder is relative to public)
	return `/${targetFolder.replace(/^.*\/public\//, "")}/${filename}`;
}

// Delete file
export async function deleteFile(path: string): Promise<void> {
	try {
		// Remove any accidental leading /public/
		const cleaned = path.replace(/^\/?public\//, "");

		// Build correct absolute path
		const absolutePath = join(process.cwd(), "public", cleaned);
		await unlink(absolutePath);
	} catch (error) {
		// Log but don't throw - graceful fallback
		console.warn(`Failed to delete file ${path}:`, error);
	}
}

// Extract extension from file
export function getFileExtension(file: File): string {
	return extname(file.name).toLowerCase();
}

// Verify mime type
export function verifyMimeType(file: File, allowedTypes: string[]): boolean {
	return allowedTypes.includes(file.type);
}
