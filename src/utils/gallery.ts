import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type GalleryImage = {
	src: string;
	alt: string;
	name: string;
};

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif)$/i;
const EXCLUDE_PATTERNS = [/^blog-placeholder/i, /^favicon/i];

function naturalCompare(a: string, b: string) {
	return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function toAlt(name: string) {
	return name
		.replace(/\.[^.]+$/, "")
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function collectFrom(dir: string, prefix = "") {
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((name) => IMAGE_EXTENSIONS.test(name))
		.filter((name) => !EXCLUDE_PATTERNS.some((pattern) => pattern.test(name)))
		.sort(naturalCompare)
		.map((name) => ({
			src: `${prefix}/${name}`.replace(/\/+/g, "/"),
			alt: toAlt(name),
			name,
		}));
}

export function getGalleryImages() {
	const publicRoot = join(process.cwd(), "public");
	const rootImages = collectFrom(publicRoot, "");
	const nestedImages = collectFrom(join(publicRoot, "images"), "/images");
	return [...rootImages, ...nestedImages];
}
