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

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Upload failed."
        }, { status: 500 });
    }
}
