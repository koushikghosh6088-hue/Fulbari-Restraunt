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

        console.log(`[UPLOAD] File received: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`);

        // Critical check: Ensure file is not empty
        if (file.size === 0) {
            console.error("[UPLOAD ERROR] File is empty! Name:", file.name);
            return NextResponse.json({
                error: "Uploaded file is empty. Please ensure the image was properly selected and processed."
            }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            console.error("[UPLOAD ERROR] File too large:", file.size);
            return NextResponse.json({
                error: "File size exceeds 5MB limit"
            }, { status: 400 });
        }

        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
        
        let arrayBuffer: ArrayBuffer;
        try {
            arrayBuffer = await file.arrayBuffer();
            console.log(`[UPLOAD] ArrayBuffer created: ${arrayBuffer.byteLength} bytes`);
            
            if (arrayBuffer.byteLength === 0) {
                console.error("[UPLOAD ERROR] ArrayBuffer is empty!");
                return NextResponse.json({
                    error: "File content is empty. The image may be corrupted."
                }, { status: 400 });
            }
        } catch (error) {
            console.error("[UPLOAD ERROR] Failed to convert file to ArrayBuffer:", error);
            return NextResponse.json({
                error: "Failed to process file content"
            }, { status: 400 });
        }

        console.log(`[UPLOAD] Uploading to bucket: ${bucket} with filename: ${fileName}`);

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, arrayBuffer, {
                cacheControl: "0, max-age=0",
                upsert: false,
                contentType: file.type || 'image/jpeg'
            });

        if (error) {
            console.error("[UPLOAD ERROR] Supabase upload error:", error);
            return NextResponse.json({
                error: `Upload to '${bucket}' bucket failed: ${error.message}. Ensure the '${bucket}' bucket exists in Supabase Storage and is set to Public with proper policies.`
            }, { status: 500 });
        }

        if (!data || !data.path) {
            console.error("[UPLOAD ERROR] No file path returned from Supabase");
            return NextResponse.json({
                error: "Upload succeeded but couldn't retrieve file path"
            }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        console.log(`[UPLOAD SUCCESS] File uploaded successfully: ${publicUrl}`);
        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error: any) {
        console.error("[UPLOAD EXCEPTION]:", error);
        return NextResponse.json({
            error: error.message || "Upload failed."
        }, { status: 500 });
    }
}
