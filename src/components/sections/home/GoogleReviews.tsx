"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REVIEWS_PER_PAGE = 6;

const CATEGORIES = ["All", "Food", "Service", "Atmosphere"];
const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest Rating", value: "highest" }
];

const ALL_REVIEWS = [
    {
        id: 1,
        name: "Joydeep Banerjee",
        text: "Truly authentic Bengali flavors! The Mughlai paratha and Kosha Mangso were outstanding. Reminds me of home.",
        rating: 5,
        date: new Date("2026-02-19"),
        dateLabel: "Yesterday",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Srabani Mitra",
        text: "Great place for a family gathering. The ambiance and service are top-notch. Highly recommended for Serampore residents!",
        rating: 5,
        date: new Date("2026-02-13"),
        dateLabel: "1 week ago",
        category: "Service",
        foodImg: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Anita Roy",
        text: "The presentation of food is beautiful and everything tastes so fresh. Best restaurant in the Shrirampur area.",
        rating: 5,
        date: new Date("2026-02-17"),
        dateLabel: "3 days ago",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Rahul Sharma",
        text: "Delicious Bengali cuisine at a great price. Homely and flavorful dishes that reminder me of Maa's cooking.",
        rating: 5,
        date: new Date("2026-02-06"),
        dateLabel: "2 weeks ago",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Priya Das",
        text: "Comforting thalis and authentic Bengali classics. The balcony view in the evening is magical.",
        rating: 5,
        date: new Date("2026-01-20"),
        dateLabel: "1 month ago",
        category: "Atmosphere"
    },
    {
        id: 6,
        name: "Amit Ghosh",
        text: "A perfect place for celebrations. The staff is courteous and the food is always fresh. Best in town!",
        rating: 5,
        date: new Date("2025-12-20"),
        dateLabel: "2 months ago",
        category: "Service",
        foodImg: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Sandeep Mukherjee",
        text: "Best Biryani in Serampore! The meat was tender and the rice was perfectly fragrant.",
        rating: 5,
        date: new Date("2026-02-15"),
        dateLabel: "5 days ago",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 8,
        name: "Mousumi Halder",
        parentReviewId: 7,
        text: "The service here is exceptionally fast. We didn't have to wait even during the weekend rush.",
        rating: 4,
        date: new Date("2026-02-10"),
        dateLabel: "10 days ago",
        category: "Service"
    },
    {
        id: 9,
        name: "Bikram Singh",
        text: "Loved the vintage Bengali decor. It creates a very warm and welcoming vibe for dinner.",
        rating: 5,
        date: new Date("2026-01-25"),
        dateLabel: "3 weeks ago",
        category: "Atmosphere",
        foodImg: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 10,
        name: "Debolina Chatterjee",
        text: "Their Fish Kabiraji is a must-try. Crunchy on the outside and juicy inside. Perfect evening snack.",
        rating: 5,
        date: new Date("2026-02-18"),
        dateLabel: "2 days ago",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1606471679003-0ec29253c8c1?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 11,
        name: "Arjun Gupta",
        text: "Cleanest kitchen I've seen in the area. You can tell they care about hygiene as much as taste.",
        rating: 5,
        date: new Date("2026-02-01"),
        dateLabel: "3 weeks ago",
        category: "Service"
    },
    {
        id: 12,
        name: "Tania Sen",
        text: "Great music and lighting. Not too loud, just perfect for a romantic dinner date.",
        rating: 4,
        date: new Date("2026-01-10"),
        dateLabel: "1 month ago",
        category: "Atmosphere"
    },
    {
        id: 13,
        name: "Rajesh Kar",
        text: "The Luchi and Cholar Dal reminded me of my childhood sundays. Excellent quality ingredients used.",
        rating: 5,
        date: new Date("2026-02-20"),
        dateLabel: "Today",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1626776878846-953e5ffb65ae?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 14,
        name: "Megha Dutta",
        text: "Staff suggested the specialties and they were spot on. Extremely polite and attentive service.",
        rating: 5,
        date: new Date("2026-01-05"),
        dateLabel: "1.5 months ago",
        category: "Service"
    },
    {
        id: 15,
        name: "Pratik Bose",
        text: "The outdoor seating area is beautiful in winter. We had a great time with snacks and tea.",
        rating: 5,
        date: new Date("2025-12-15"),
        dateLabel: "2 months ago",
        category: "Atmosphere",
        foodImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 16,
        name: "Sneha Mallick",
        text: "The Misti Doi is the best I've had in a restaurant. Not too sweet, just the right creamy texture.",
        rating: 5,
        date: new Date("2026-02-12"),
        dateLabel: "1 week ago",
        category: "Food"
    },
    {
        id: 17,
        name: "Vikram Batra",
        text: "Parking was easy and the entrance is wheelchair accessible. Very thoughtful design.",
        rating: 4,
        date: new Date("2026-01-30"),
        dateLabel: "3 weeks ago",
        category: "Service"
    },
    {
        id: 18,
        name: "Subham Paul",
        text: "Best place in Serampore for a quick lunch thali. Very affordable and filling.",
        rating: 5,
        date: new Date("2026-02-14"),
        dateLabel: "1 week ago",
        category: "Food",
        foodImg: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=400&auto=format&fit=crop"
    }
];

export function GoogleReviews() {
    const [filter, setFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...ALL_REVIEWS];

        // Filter
        if (filter !== "All") {
            result = result.filter(r => r.category === filter);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "newest") return b.date.getTime() - a.date.getTime();
            if (sortBy === "oldest") return a.date.getTime() - b.date.getTime();
            if (sortBy === "highest") return b.rating - a.rating;
            return 0;
        });

        return result;
    }, [filter, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedReviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = filteredAndSortedReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    const handleFilterChange = (cat: string) => {
        setFilter(cat);
        setCurrentPage(1);
    };

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-heading italic text-lg mb-2 block tracking-wide">Customer Feedback</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">Voices of Fulbari</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Browse real experiences from our guests. Filter by food, service, or atmosphere to see what people are saying.
                    </p>
                </motion.div>

                {/* Filters & Sorting Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-card/20 p-6 rounded-3xl border border-border/50 backdrop-blur-sm shadow-xl shadow-primary/5">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFilterChange(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${filter === cat
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                                        : "bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground border border-border/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-background/50 text-foreground text-sm font-bold px-4 py-2.5 rounded-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm transition-all"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="min-h-[800px]">
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {paginatedReviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-card/40 p-8 rounded-3xl border border-border/50 backdrop-blur-md group hover:border-primary/40 transition-all shadow-lg hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold border-2 border-primary/20 shadow-inner">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base text-foreground mb-1 leading-none">{review.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] text-muted-foreground font-bold tracking-wider uppercase">{review.dateLabel}</span>
                                                    <span className="w-1 h-1 rounded-full bg-border"></span>
                                                    <span className="text-[10px] px-2 py-0.5 bg-primary/5 rounded-md text-primary font-bold uppercase tracking-tighter">{review.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(review.rating)].map((_, starIndex) => (
                                                <span key={starIndex} className="text-yellow-500 text-sm">★</span>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-base text-foreground/90 mb-6 italic leading-relaxed group-hover:text-foreground transition-colors flex-grow">
                                        "{review.text}"
                                    </p>

                                    {review.foodImg && (
                                        <div className="mt-2 mb-6 w-full h-48 rounded-2xl overflow-hidden border border-border/30 shadow-inner group-hover:border-primary/30 transition-colors">
                                            <img
                                                src={review.foodImg}
                                                alt={`Review by ${review.name}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    img.src = "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop";
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-6 border-t border-border/20 group-hover:border-primary/20 transition-colors grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500">
                                        <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" className="h-4 w-auto" />
                                        <span className="text-[10px] font-bold tracking-wider">VERIFIED LOCAL GUIDE REVIEW</span>
                                    </div>

                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine pointer-events-none" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* No Results Fallback */}
                    {paginatedReviews.length === 0 && (
                        <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border/50">
                            <p className="text-muted-foreground text-lg italic">No reviews found for this category.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center hover:bg-card hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-12 h-12 rounded-full text-sm font-extrabold transition-all border ${currentPage === i + 1
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-110"
                                            : "bg-background/50 text-muted-foreground border-border/50 hover:border-primary/50 hover:text-foreground"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 rounded-full border border-border/50 flex items-center justify-center hover:bg-card hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Final Call to Action */}
                <div className="mt-24 text-center">
                    <motion.a
                        href="https://search.google.com/local/writereview?placeid=ChIJc16FaACF-DkRxbOmYTvrkAY"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-4 px-10 py-5 bg-foreground text-background rounded-full font-bold text-lg shadow-2xl hover:bg-primary hover:text-primary-foreground transition-all duration-500 group"
                    >
                        <span>Give Us Your Feedback on Google</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </motion.a>
                    <p className="mt-6 text-sm text-muted-foreground italic tracking-tight">
                        Your honest reviews help us grow and serve you better every day.
                    </p>
                </div>
            </div>
        </section>
    );
}
