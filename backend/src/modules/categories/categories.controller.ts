import fs from "fs";
import path from "path";
import { prisma } from "../../utils/prisma";

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];

// Convert filename to human-readable label
function humanizeFilename(name: string) {
	const noExt = name.replace(path.extname(name), "");
	// replace separators with space and collapse multi-spaces
	const spaced = noExt.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
	// Capitalize each word
	return spaced
		.split(" ")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");
}

// Scan predefined directories for image files to use as categories
async function scanFilesystemCategories() {
	// Directories to scan for category images (relative to project root)
	const candidateDirs = ["public/categories"];

	const found: { label: string; imageUrl: string }[] = [];
	const seen = new Set<string>();

	// turns relative path to absolute and scans for image files
	for (const dir of candidateDirs) {
		const abs = path.join(process.cwd(), dir);

		// skip non-existing directories
		if (!fs.existsSync(abs)) continue;

		// read directory contents
		const items = await fs.promises.readdir(abs);

		// process each file
		for (const file of items) {
			const ext = path.extname(file).toLowerCase();
			if (!IMAGE_EXT.includes(ext)) continue;

			// compute image URL relative to the `public` static root
			const rel = path
				.relative(path.join(process.cwd(), "public"), path.join(abs, file))
				.replace(/\\/g, "/");
			const url = `/static/${rel}`;

			// skip duplicates
			if (seen.has(url)) continue;

			seen.add(url);
			found.push({ label: humanizeFilename(file), imageUrl: url });
		}
	}

	return found;
}

// Fetch categories from DB, fall back to filesystem scan
export async function getCategories(baseUrl?: string) {
	// Try DB first
	try {
		const db = await prisma.category.findMany({ orderBy: { order: "asc" } });
		if (db && db.length > 0) {
			return db.map((c) => ({
				label: c.label,
				imageUrl:
					typeof c.imageUrl === "string" &&
					c.imageUrl.startsWith("/") &&
					baseUrl
						? `${baseUrl}${c.imageUrl}`
						: c.imageUrl,
			}));
		}
	} catch (err) {
		// if Prisma/client not configured yet, fall through to filesystem scanning
		console.warn("Prisma query failed in getCategories, check error:", err);
	}

	// fallback to scanning local public folders
	const files = await scanFilesystemCategories();
	if (baseUrl) {
		return files.map((f) => ({
			label: f.label,
			imageUrl: f.imageUrl.startsWith("/")
				? `${baseUrl}${f.imageUrl}`
				: f.imageUrl,
		}));
	}
	return files;
}

// Scan filesystem and create category records in DB
export async function createCategory(payload: {
	label: string;
	imageUrl: string;
	order?: number;
}) {
	// Create category record in DB
	const { label, imageUrl, order = 0 } = payload;
	return prisma.category.create({ data: { label, imageUrl, order } });
}

export async function getCategoryById(id: string) {
	return prisma.category.findUnique({ where: { id } });
}

export async function updateCategory(id: string, payload: { label?: string; imageUrl?: string; order?: number }) {
	return prisma.category.update({ where: { id }, data: payload });
}

export async function deleteCategory(id: string) {
	return prisma.category.delete({ where: { id } });
}
