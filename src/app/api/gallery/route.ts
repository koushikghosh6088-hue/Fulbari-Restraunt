import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-static';
export const revalidate = false;

const CACHE_HEADERS = {
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
};

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("gallery_items")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Clean up gallery items - ensure URLs are valid
        const cleanedData = (data ?? []).map(item => ({
            ...item,
            url: item.url && typeof item.url === 'string' ? item.url.trim() : null
        })).filter(item => item.url);
        
        return NextResponse.json(cleanedData, {
            headers: CACHE_HEADERS,
        });
    } catch (error: any) {
        console.error("Gallery GET error:", error);
        return NextResponse.json([], {
            status: 200,
            headers: CACHE_HEADERS,
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, item } = body;

        if (action === "ADD") {
            // Validate URL
            if (!item.url || typeof item.url !== 'string' || item.url.trim() === '') {
                return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
            }

            const { data, error } = await supabase
                .from("gallery_items")
                .insert([{
                    url: item.url.trim(),
                    category: item.category,
                }])
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, item: data });
        }

        if (action === "DELETE") {
            const { error } = await supabase
                .from("gallery_items")
                .delete()
                .eq("id", item.id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Gallery POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
