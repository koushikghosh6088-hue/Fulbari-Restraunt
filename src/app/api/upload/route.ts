import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const bucket = (formData.get("bucket") as string) || "menu-images";

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        console.log(`Attempting to upload to bucket: ${bucket} using anon key`);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, buffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type || 'image/jpeg'
            });

        if (error) {
            console.error("Supabase Storage Upload Error:", error);
            // Fallback: If 'events' bucket fails, silently try 'menu-images' as it's known to work
            if (bucket === "events") {
                console.log("Fallback: Attempting to use menu-images bucket instead...");
                const { data: fbData, error: fbError } = await supabase.storage
                    .from("menu-images")
                    .upload(`events/${fileName}`, buffer, {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: file.type || 'image/jpeg'
                    });

                if (!fbError) {
                    const { data: { publicUrl } } = supabase.storage.from("menu-images").getPublicUrl(`events/${fileName}`);
                    return NextResponse.json({ success: true, url: publicUrl, note: "Used fallback bucket" });
                }
            }

            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("Upload Route Error:", error);
        return NextResponse.json({
            error: error.message || "Upload failed."
        }, { status: 500 });
    }
}
