import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/menu_items.json");

function getMenu() {
    const fileData = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(fileData);
}

function saveMenu(data: any) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
    try {
        const menu = getMenu();
        return NextResponse.json(menu);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, item } = body;
        const menu = getMenu();

        if (action === "ADD") {
            const newItem = {
                ...item,
                id: Date.now().toString(),
                available: true
            };
            menu.push(newItem);
            saveMenu(menu);
            return NextResponse.json({ success: true, item: newItem });
        }

        if (action === "TOGGLE") {
            const index = menu.findIndex((i: any) => i.id === item.id);
            if (index !== -1) {
                menu[index].available = !menu[index].available;
                saveMenu(menu);
                return NextResponse.json({ success: true, item: menu[index] });
            }
        }

        if (action === "DELETE") {
            const newMenu = menu.filter((i: any) => i.id !== item.id);
            saveMenu(newMenu);
            return NextResponse.json({ success: true });
        }

        if (action === "UPDATE_PRICE") {
            const index = menu.findIndex((i: any) => i.id === item.id);
            if (index !== -1) {
                menu[index].price = item.price;
                saveMenu(menu);
                return NextResponse.json({ success: true, item: menu[index] });
            }
        }

        if (action === "UPDATE") {
            const index = menu.findIndex((i: any) => i.id === item.id);
            if (index !== -1) {
                menu[index] = { ...menu[index], ...item };
                saveMenu(menu);
                return NextResponse.json({ success: true, item: menu[index] });
            }
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Operation failed" }, { status: 500 });
    }
}
