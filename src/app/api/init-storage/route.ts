import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const buckets = ["gallery", "events", "menu-images"];
    const results: any = {};

    for (const b of buckets) {
        // Try to list files as a test of 'Public' status and existence
        const { data, error } = await supabase.storage.from(b).list('', { limit: 1 });

        if (error) {
            results[b] = {
                status: "Error/Missing",
                message: error.message,
                tip: `Ensure bucket '${b}' exists in Supabase Storage and is set to 'Public'.`
            };
        } else {
            results[b] = {
                status: "OK",
                count: data?.length ?? 0
            };
        }
    }

    return NextResponse.json({
        success: true,
        buckets: results,
        suggestion: "If any bucket shows Error, go to Supabase Dashboard > Storage > Create New Bucket (Public)."
    });
}
