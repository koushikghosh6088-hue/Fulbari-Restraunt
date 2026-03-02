import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { username, password } = await request.json();

    // Secure credentials provided by the user
    if (username === "fulbari" && password === "1234567890") {
        return NextResponse.json({ success: true, message: "Login successful" });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
