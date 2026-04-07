const fs = require('fs');
async function testUpload() {
    const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const fileData = Buffer.from("fake image data 123", "utf-8");

    let body = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from('Content-Disposition: form-data; name="bucket"\r\n\r\n'),
        Buffer.from('events\r\n'),
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from('Content-Disposition: form-data; name="file"; filename="test.jpg"\r\n'),
        Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
        fileData,
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    try {
        const res = await fetch("https://fulbarirestora.com/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": `multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`
            },
            body: body
        });
        console.log("Vercel API Upload Status:", res.status);
        const text = await res.text();
        console.log("Vercel API Upload Response:", text);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
testUpload();
