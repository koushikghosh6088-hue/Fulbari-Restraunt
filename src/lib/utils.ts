import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeImageUrl(url: string | undefined | null) {
    if (!url) return "";
    let s = url.trim();

    // 1. Force HTTPS to prevent mixed content issues on Vercel
    if (s.startsWith("http://")) {
        s = s.replace("http://", "https://");
    }

    // 2. Handle Unsplash optimization
    if (s.includes("unsplash.com") && !s.includes("auto=format")) {
        const separator = s.includes("?") ? "&" : "?";
        s = `${s}${separator}auto=format&fit=crop&q=80&w=1200`;
    }

    // 3. Handle spaces and basic special characters safely
    // We avoid full encodeURI as it can break some Supabase signed URL parameters
    // but we must use proper hex codes for parentheses
    return s.replace(/ /g, "%20")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
}
