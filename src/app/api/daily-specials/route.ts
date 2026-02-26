import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

const today = () => new Date().toISOString().split("T")[0];

export async function GET() {
    try {
        // Fetch today's special menu_item_ids
        const { data: specials, error: specErr } = await supabase
            .from("daily_specials")
            .select("menu_item_id")
            .eq("special_date", today());

        if (specErr) throw specErr;
        if (!specials || specials.length === 0) return NextResponse.json([]);

        const ids = specials.map((s: any) => s.menu_item_id);

        // Fetch the actual menu items
        const { data: items, error: menuErr } = await supabase
            .from("menu_items")
            .select("*")
            .in("id", ids)
            .eq("available", true);

        if (menuErr) throw menuErr;
        return NextResponse.json(items ?? []);
    } catch (error: any) {
        console.error("Daily specials GET error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, menu_item_id } = body;

        if (action === "ADD") {
            const { error } = await supabase
                .from("daily_specials")
                .upsert({ menu_item_id, special_date: today() }, { onConflict: "menu_item_id,special_date" });
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === "REMOVE") {
            const { error } = await supabase
                .from("daily_specials")
                .delete()
                .eq("menu_item_id", menu_item_id)
                .eq("special_date", today());
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
