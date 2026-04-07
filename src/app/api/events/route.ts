import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CACHE_HEADERS = {
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';

        let query = supabase
            .from("events")
            .select("*")
            .order("event_date", { ascending: true });

        // Admin dashboard needs all events; public pages only need active ones
        if (!showAll) {
            query = query.eq("is_active", true);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Filter out any events with empty image arrays and ensure image URLs are valid
        const cleanedData = (data ?? []).map(event => ({
            ...event,
            image_urls: Array.isArray(event.image_urls)
                ? event.image_urls.filter((url: string) => url && url.trim() !== "")
                : []
        }));

        return NextResponse.json(cleanedData, {
            headers: CACHE_HEADERS,
        });
    } catch (error: any) {
        console.error("Events GET error:", error);
        return NextResponse.json([], {
            status: 200,
            headers: CACHE_HEADERS,
        });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, event } = body;

        if (action === "ADD") {
            // Clean up image URLs - remove empty strings and ensure they're strings
            const cleanImageUrls = (Array.isArray(event.image_urls)
                ? event.image_urls.filter((url: any) => url && typeof url === 'string' && url.trim() !== "")
                : []) as string[];

            const { data, error } = await supabase
                .from("events")
                .insert([{
                    title: event.title,
                    description: event.description,
                    event_date: event.event_date,
                    poster_url: event.poster_url ?? null,
                    image_urls: cleanImageUrls,
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

        if (action === "UPDATE") {
            // Clean up image URLs - remove empty strings and ensure they're strings
            const cleanImageUrls = (Array.isArray(event.image_urls)
                ? event.image_urls.filter((url: any) => url && typeof url === 'string' && url.trim() !== "")
                : []) as string[];

            const { data, error } = await supabase
                .from("events")
                .update({
                    title: event.title,
                    description: event.description,
                    event_date: event.event_date,
                    poster_url: event.poster_url ?? null,
                    image_urls: cleanImageUrls,
                    is_active: event.is_active ?? true,
                })
                .eq("id", event.id)
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, event: data });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Events POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
