import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sanitizeImageUrl(url: string | undefined | null) {
    if (!url) return "";
    // Handle Unsplash optimization if missing
    if (url.includes("unsplash.com") && !url.includes("auto=format")) {
        return `${url}${url.includes("?") ? "&" : "?"}auto=format&fit=crop&q=80&w=800`;
    }
    // Handle spaces in URLs by encoding them
    return url.replace(/ /g, "%20");
}
