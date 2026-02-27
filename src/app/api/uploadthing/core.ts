import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    menuImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for menu item");
            console.log("file url", file.url);

            // return data to client
            return { uploadedBy: "admin", url: file.url };
        }),

    eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for event image");
            console.log("file url", file.url);
            return { uploadedBy: "admin", url: file.url };
        }),

    galleryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for gallery image");
            return { uploadedBy: "admin", url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
