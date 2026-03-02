import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('name');

        if (error) throw error;
        return NextResponse.json(data);
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
            const { error } = await supabase
                .from('menu_items')
                .delete()
                .eq('id', item.id);

            if (error) throw error;
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
