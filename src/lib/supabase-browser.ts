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
 * - Converts to JPEG at 0.85 quality
 * - Result is always well under 2MB, safe for /api/upload
 */
export async function compressImageForUpload(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        // For non-image files, return as-is
        if (!file.type.startsWith('image/')) {
            console.log("Non-image file, returning as-is:", file.type);
            resolve(file);
            return;
        }

        // If file is already small (under 500KB), skip compression
        if (file.size < 500000) {
            console.log("File already small, skipping compression:", file.size);
            resolve(file);
            return;
        }

        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        
        // Set timeout to prevent hanging
        const timeout = setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
            console.warn("Image load timeout, using original file");
            resolve(file);
        }, 10000);

        img.onload = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(objectUrl);

            try {
                const MAX_DIM = (typeof window !== 'undefined' && window.innerWidth < 768) ? 1080 : 1920;
                let { naturalWidth: w, naturalHeight: h } = img;

                console.log(`Image dimensions: ${w}x${h}`);

                // Downscale if larger than 1920px
                if (w > MAX_DIM || h > MAX_DIM) {
                    if (w > h) {
                        h = Math.round((h / w) * MAX_DIM);
                        w = MAX_DIM;
                    } else {
                        w = Math.round((w / h) * MAX_DIM);
                        h = MAX_DIM;
                    }
                    console.log(`Resized to: ${w}x${h}`);
                }

                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.warn("Canvas context not available, using original");
                    resolve(file);
                    return;
                }

                // Draw image on canvas
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);

                // Convert to blob with proper error handling
                // choose quality based on viewport: lower on mobile for faster loads
                const quality = (typeof window !== 'undefined' && window.innerWidth < 768) ? 0.7 : 0.85;
                canvas.toBlob(
                    (blob) => {
                        try {
                            if (!blob || blob.size === 0) {
                                console.warn("Canvas blob is empty, using original file");
                                resolve(file);
                                return;
                            }

                            console.log(`Compressed size: ${blob.size}, Original size: ${file.size}`);

                            // Use compressed version if it's smaller, otherwise use original
                            const finalBlob = blob.size < file.size ? blob : file;
                            const fileName = file.name.replace(/\.[^/.]+$/, '.jpg');
                            
                            const compressedFile = new File([finalBlob], fileName, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });

                            console.log(`Final file size: ${compressedFile.size}, name: ${compressedFile.name}`);
                            resolve(compressedFile);
                        } catch (error) {
                            console.error("Error creating compressed file:", error);
                            resolve(file);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            } catch (error) {
                console.error("Error during compression:", error);
                resolve(file);
            }
        };

        img.onerror = (error) => {
            clearTimeout(timeout);
            URL.revokeObjectURL(objectUrl);
            console.error("Image load error:", error);
            resolve(file); // Fallback to original on error
        };

        img.src = objectUrl;
    });
}
