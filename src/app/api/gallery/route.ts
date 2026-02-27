import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("gallery_items")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data ?? [], {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Pragma": "no-cache",
            },
        });
    } catch (error: any) {
        console.error("Gallery GET error:", error);
        return NextResponse.json([], {
            status: 200,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Pragma": "no-cache",
            },
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, item } = body;

        if (action === "ADD") {
            const { data, error } = await supabase
                .from("gallery_items")
                .insert([{
                    url: item.url,
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
