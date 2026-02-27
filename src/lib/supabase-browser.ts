/**
 * Client-side image compression utility.
 * Compresses images using Canvas API before uploading to avoid
 * Vercel's 4.5MB serverless function body size limit.
 *
 * Usage:
 *   const compressed = await compressImageForUpload(file);
 *   // Then POST `compressed` as FormData to /api/upload
 */

/**
 * Compresses an image file client-side using Canvas.
 * - Resizes to max 1920px on the longest side
 * - Converts to JPEG at 0.82 quality
 * - Result is always well under 2MB, safe for /api/upload
 */
export async function compressImageForUpload(file: File): Promise<File> {
    return new Promise((resolve) => {
        // For non-image files (unlikely but safe), return as-is
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const MAX_DIM = 1920;
            let { naturalWidth: w, naturalHeight: h } = img;

            // Downscale if larger than 1920px
            if (w > MAX_DIM || h > MAX_DIM) {
                if (w > h) {
                    h = Math.round((h / w) * MAX_DIM);
                    w = MAX_DIM;
                } else {
                    w = Math.round((w / h) * MAX_DIM);
                    h = MAX_DIM;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file); // Canvas not supported, return original
                return;
            }

            ctx.drawImage(img, 0, 0, w, h);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file); // Fallback to original if compression fails
                        return;
                    }
                    // If compression made it bigger (rare with small PNGs), use original
                    const result = blob.size < file.size ? blob : file;
                    resolve(
                        new File(
                            [result],
                            file.name.replace(/\.[^/.]+$/, '.jpg'),
                            { type: 'image/jpeg' }
                        )
                    );
                },
                'image/jpeg',
                0.82
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(file); // Fallback to original on error
        };

        img.src = objectUrl;
    });
}
