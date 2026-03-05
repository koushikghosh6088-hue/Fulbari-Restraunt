import fetch from "node-fetch";

// Helper to get a date relative to today
const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
};

// Fallback reviews to use if the API fails or if no API key is set
export const FALLBACK_REVIEWS = [
    {
        id: 1,
        name: "Joydeep Banerjee",
        text: "Truly authentic Bengali flavors! The Mughlai paratha and Kosha Mangso were outstanding. Reminds me of home.",
        rating: 5,
        date: daysAgo(1),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Srabani Mitra",
        text: "Great place for a family gathering. The ambiance and service are top-notch. Highly recommended for Serampore residents!",
        rating: 5,
        date: daysAgo(7),
        category: "Service",
        foodImg: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Anita Roy",
        text: "The presentation of food is beautiful and everything tastes so fresh. Best restaurant in the Shrirampur area.",
        rating: 5,
        date: daysAgo(3),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Rahul Sharma",
        text: "Delicious Bengali cuisine at a great price. Homely and flavorful dishes that reminder me of Maa's cooking.",
        rating: 5,
        date: daysAgo(14),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Priya Das",
        text: "Comforting thalis and authentic Bengali classics. The balcony view in the evening is magical.",
        rating: 5,
        date: daysAgo(30),
        category: "Atmosphere"
    },
    {
        id: 6,
        name: "Amit Ghosh",
        text: "A perfect place for celebrations. The staff is courteous and the food is always fresh. Best in town!",
        rating: 5,
        date: daysAgo(60),
        category: "Service",
        foodImg: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Sandeep Mukherjee",
        text: "Best Biryani in Serampore! The meat was tender and the rice was perfectly fragrant. The spices are just right.",
        rating: 5,
        date: daysAgo(5),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "Mousumi Halder",
        text: "The service here is exceptionally fast. We didn't have to wait even during the weekend rush. Staff is very humble.",
        rating: 4,
        date: daysAgo(10),
        category: "Service"
    },
    {
        id: 9,
        name: "Bikram Singh",
        text: "Loved the vintage Bengali decor. It creates a very warm and welcoming vibe for dinner. Will visit again with friends.",
        rating: 5,
        date: daysAgo(21),
        category: "Atmosphere",
        foodImg: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 10,
        name: "Debolina Chatterjee",
        text: "Their Fish Kabiraji is a must-try. Crunchy on the outside and juicy inside. Perfect evening snack with tea.",
        rating: 5,
        date: daysAgo(2),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1606471679003-0ec29253c8c1?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 11,
        name: "Arjun Gupta",
        text: "Cleanest kitchen I've seen in the area. You can tell they care about hygiene as much as taste. Professional staff.",
        rating: 5,
        date: daysAgo(21),
        category: "Service"
    },
    {
        id: 12,
        name: "Tania Sen",
        text: "Great music and lighting. Not too loud, just perfect for a romantic dinner date. Elegant and peaceful.",
        rating: 4,
        date: daysAgo(30),
        category: "Atmosphere",
        foodImg: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 13,
        name: "Rajesh Kar",
        text: "The Luchi and Cholar Dal reminded me of my childhood Sundays. Excellent quality ingredients used by the team.",
        rating: 5,
        date: new Date(), // Today
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1626776878846-953e5ffb65ae?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 14,
        name: "Megha Dutta",
        text: "Staff suggested the specialties and they were spot on. Extremely polite and attentive service even during late hours.",
        rating: 5,
        date: daysAgo(45),
        category: "Service"
    },
    {
        id: 15,
        name: "Pratik Bose",
        text: "The outdoor seating area is beautiful in winter. We had a great time with snacks and tea. Very cozy place.",
        rating: 5,
        date: daysAgo(60),
        category: "Atmosphere",
        foodImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 16,
        name: "Sneha Mallick",
        text: "The Misti Doi is the best I've had in a restaurant. Not too sweet, just the right creamy texture. Must try!",
        rating: 5,
        date: daysAgo(7),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 17,
        name: "Vikram Batra",
        text: "Parking was easy and the entrance is wheelchair accessible. Very thoughtful design for all types of guests.",
        rating: 4,
        date: daysAgo(21),
        category: "Service"
    },
    {
        id: 18,
        name: "Subham Paul",
        text: "Best place in Serampore for a quick lunch thali. Very affordable and filling lunch options available.",
        rating: 5,
        date: daysAgo(7),
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=400&auto=format&fit=crop"
    }
];

function getTimeAgo(date: Date): string {
    const elapsed = (Date.now() - date.getTime()) / 1000;
    const days = Math.floor(elapsed / 86400);
    const months = Math.floor(days / 30);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 14) return "1 week ago";
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (months === 1) return "1 month ago";
    return `${months} months ago`;
}

// Simple categorization based on keywords
function getReviewCategory(text: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.match(/staff|waiter|service|friendly|polite|fast|wait/)) {
        return "Service";
    }
    if (lowerText.match(/ambiance|decor|music|vibe|clean|view|seating|place/)) {
        return "Atmosphere";
    }
    return "Food"; // Default
}

export async function fetchGoogleReviews() {
    const PLACE_ID = "ChIJc16FaACF-DkRxbOmYTvrkAY";
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    // Map fallbacks to include dynamic dateLabel
    const processedFallbacks = FALLBACK_REVIEWS.map(r => ({
        ...r,
        dateLabel: getTimeAgo(r.date)
    }));

    if (!API_KEY) {
        console.warn("No GOOGLE_PLACES_API_KEY found, using fallback reviews.");
        return processedFallbacks;
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json() as any;

        if (data.status === "OK" && data.result && data.result.reviews) {
            // Google only returns top 5
            const apiReviews = data.result.reviews.map((r: any, idx: number) => {
                const reviewDate = new Date(r.time * 1000);
                const category = getReviewCategory(r.text);
                const dateLabel = getTimeAgo(reviewDate);

                return {
                    id: `api-${idx}-${r.time}`,
                    name: r.author_name,
                    text: r.text,
                    rating: r.rating,
                    category: category,
                    dateLabel: dateLabel,
                    date: reviewDate,
                };
            });

            // Combine API reviews with fallbacks if they are missing
            const apiNames = new Set(apiReviews.map((ar: any) => ar.name));
            const filteredFallbacks = processedFallbacks.filter(fr => !apiNames.has(fr.name));

            return [...apiReviews, ...filteredFallbacks];
        } else {
            console.warn("Failed to fetch Google Reviews (API response error)", data.status);
            return processedFallbacks;
        }
    } catch (error) {
        console.error("Error fetching Google Reviews:", error);
        return processedFallbacks;
    }
}
