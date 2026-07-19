const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.82;

/**
 * Converts an image File to WebP in the browser (canvas-based) and caps its
 * longest edge at MAX_DIMENSION, so uploads from phone cameras don't ship
 * multi-megabyte originals into storage. Falls back to the original file for
 * formats that shouldn't be rasterized (SVG, GIF) or if conversion fails for
 * any reason (e.g. an unsupported codec).
 */
export async function toWebp(file: File): Promise<File> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );
    if (!blob) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch {
    return file;
  }
}
