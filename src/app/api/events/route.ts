import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("is_active", true)
            .order("event_date", { ascending: true });

        if (error) throw error;
        return NextResponse.json(data ?? []);
    } catch (error: any) {
        console.error("Events GET error:", error);
        return NextResponse.json([], { status: 200 }); // graceful fallback
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, event } = body;

        if (action === "ADD") {
            const { data, error } = await supabase
                .from("events")
                .insert([{
                    title: event.title,
                    description: event.description,
                    event_date: event.event_date,
                    poster_url: event.poster_url ?? null,
                    image_urls: event.image_urls ?? [],
                    is_active: true,
                }])
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, event: data });
        }

        if (action === "DELETE") {
            const { error } = await supabase
                .from("events")
                .delete()
                .eq("id", event.id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        if (action === "TOGGLE") {
            const { data, error } = await supabase
                .from("events")
                .update({ is_active: !event.is_active })
                .eq("id", event.id)
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, event: data });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
