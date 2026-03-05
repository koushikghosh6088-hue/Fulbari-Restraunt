import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/google-reviews';

// This route can be hit by ISR or a Cron job
export const revalidate = 86400; // Cache for 1 day

export async function GET() {
    try {
        const reviews = await fetchGoogleReviews();

        return NextResponse.json({
            success: true,
            data: reviews,
            fetchedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in /api/cron/reviews:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
    }
}
