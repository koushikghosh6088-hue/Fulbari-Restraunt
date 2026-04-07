import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('name');

        if (error) throw error;
        
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error("Supabase Load Error:", error);
        return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, item } = body;

        if (action === "ADD") {
            const insertData = {
                ...item,
                available: true
            };
            const { data, error } = await supabase
                .from('menu_items')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, item: data });
        }

        if (action === "TOGGLE") {
            const { data, error } = await supabase
                .from('menu_items')
                .update({ available: !item.available })
                .eq('id', item.id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, item: data });
        }

        if (action === "DELETE") {
            console.log("Attempting to delete item with ID:", item.id);
            // First remove from daily_specials to avoid foreign key constraint issues
            const { error: specialError } = await supabase
                .from('daily_specials')
                .delete()
                .eq('menu_item_id', item.id);
            
            if (specialError) {
                console.error("Error deleting from daily_specials:", specialError);
            } else {
                console.log("Successfully removed from daily_specials (or not found)");
            }

            const { error: menuError } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', item.id);

            if (menuError) {
                console.error("Error deleting from menu_items:", menuError);
                throw menuError;
            }
            
            console.log("Successfully deleted item from menu_items");
            return NextResponse.json({ success: true });
        }

        if (action === "UPDATE_PRICE") {
            const { data, error } = await supabase
                .from('menu_items')
                .update({ price: item.price })
                .eq('id', item.id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, item: data });
        }

        if (action === "UPDATE") {
            const { data, error } = await supabase
                .from('menu_items')
                .update(item)
                .eq('id', item.id)
                .select()
                .single();

            if (error) throw error;
            return NextResponse.json({ success: true, item: data });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Supabase API Error:", error);
        return NextResponse.json({ error: error.message || "Operation failed" }, { status: 500 });
    }
}
