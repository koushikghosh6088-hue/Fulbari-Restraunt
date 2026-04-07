import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

// Function to normalize strings for matching
function normalize(s: string) {
    if (!s) return "";
    return s.toLowerCase()
        .replace(/\d+pc\b/g, "")
        .replace(/\(.*\)/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "tmp", "ut_files_cleaned.json");
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "Cleaned UT files not found" }, { status: 404 });
        }
        
        const utFiles = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const { data: menuItems, error: fetchError } = await supabase
            .from("menu_items")
            .select("id, name, image");

        if (fetchError) throw fetchError;
        if (!menuItems) return NextResponse.json({ error: "No menu items found" });

        const updates = [];
        for (const item of menuItems) {
            const normMenu = normalize(item.name);
            if (normMenu.length < 3) continue;

            let bestMatch = null;
            // Priority 1: Exact match
            for (const file of utFiles) {
                const normFile = normalize(file.name.split(".")[0]);
                if (normFile === normMenu) {
                    bestMatch = file;
                    break;
                }
            }
            // Priority 2: Fuzzy match
            if (!bestMatch) {
                for (const file of utFiles) {
                    const normFile = normalize(file.name.split(".")[0]);
                    if (normFile.length < 4) continue;
                    if (normMenu.includes(normFile) || normFile.includes(normMenu)) {
                        bestMatch = file;
                        break;
                    }
                }
            }

            if (bestMatch) {
                const newUrl = `https://utfs.io/f/${bestMatch.key}`;
                const isUnsplash = item.image?.includes("unsplash.com");
                const isEmpty = !item.image || item.image.trim() === "";
                if (isUnsplash || isEmpty) {
                    updates.push({ id: item.id, name: item.name, image: newUrl });
                }
            }
        }

        const results = [];
        for (const up of updates) {
            const { error: updateError } = await supabase
                .from("menu_items")
                .update({ image: up.image })
                .eq("id", up.id);
            results.push({ name: up.name, success: !updateError });
        }

        return NextResponse.json({ success: true, matches: updates.length, results });

    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
