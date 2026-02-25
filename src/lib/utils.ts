import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeImageUrl(url: string | undefined | null) {
    if (!url) return "";
    let s = url.trim();
    // Handle Unsplash optimization if missing
    if (s.includes("unsplash.com") && !s.includes("auto=format")) {
        const separator = s.includes("?") ? "&" : "?";
        s = `${s}${separator}auto=format&fit=crop&q=80&w=800`;
    }
    // Handle spaces in URLs by encoding them simply
    return s.replace(/ /g, "%20");
}
