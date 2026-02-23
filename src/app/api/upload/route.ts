import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload directory
        const uploadDir = join(process.cwd(), "public", "images", "menu");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Already exists or other error
        }

        // Generate unique filename
        const fileExtension = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
        const path = join(uploadDir, fileName);

        // Write file to filesystem
        await writeFile(path, buffer);

        // Return the public URL
        const publicUrl = `/images/menu/${fileName}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
