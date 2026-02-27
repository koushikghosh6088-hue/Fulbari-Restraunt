import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeImageUrl(url: string | undefined | null) {
    if (!url) return "";
    let s = url.trim();

    // Don't process empty strings
    if (s === "") return "";

    // 1. Force HTTPS to prevent mixed content issues on Vercel
    if (s.startsWith("http://")) {
        s = s.replace("http://", "https://");
    }

    // 2. Handle Supabase storage URLs - add cache busting (don’t add unsplash-specific params)
    if (s.includes("supabase.co")) {
        // Ensure HTTPS
        if (!s.startsWith("https://")) {
            s = "https://" + s.replace(/^https?:\/\//, "");
        }
        // Add cache buster to prevent stale images
        const finalSep = s.includes("?") ? "&" : "?";
        if (!s.includes("t=")) {
            s = `${s}${finalSep}t=${Date.now()}`;
        }
        return s.replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
    }

    // 3. Handle Unsplash optimization
    if (s.includes("unsplash.com")) {
        if (!s.includes("auto=format")) {
            const separator = s.includes("?") ? "&" : "?";
            s = `${s}${separator}auto=format&fit=crop&q=80&w=1200`;
        }
    }

    // 4. Handle spaces and special characters
    return s.replace(/ /g, "%20")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
}

/**
 * Converts standard Unsplash photo page links to direct image URLs.
 */
export function fixUnsplashUrl(url: string | undefined | null) {
    if (!url) return "";
    const s = url.trim();
    // If it's a standard Unsplash photo page link
    // Example: https://unsplash.com/photos/a-bowl-of-soup-gDwy_JEoz8k
    if (s.includes("unsplash.com/photos/")) {
        const parts = s.split("/");
        const id = parts[parts.length - 1];
        // If the ID has a slug name before it (e.g., bowl-of-soup-ABC123)
        const idParts = id.split("-");
        const actualId = idParts[idParts.length - 1];
        return `https://images.unsplash.com/photo-${actualId}?q=80&w=2070&auto=format&fit=crop`;
    }
    return s;
}
