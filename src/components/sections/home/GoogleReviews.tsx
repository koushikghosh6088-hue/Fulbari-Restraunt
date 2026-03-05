"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const REVIEWS_PER_PAGE = 5;

const CATEGORIES = ["All", "Food", "Service", "Atmosphere"];
const SORT_OPTIONS = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest Rating", value: "highest" }
];

const ALL_REVIEWS: any[] = [];

export function GoogleReviews() {
    const [filter, setFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);
    const [reviews, setReviews] = useState(ALL_REVIEWS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/cron/reviews');
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        // Ensure dates are parsed back to Date objects
                        const parsedData = data.data.map((r: any) => ({
                            ...r,
                            date: r.date ? new Date(r.date) : new Date()
                        }));
                        setReviews(parsedData);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch Google reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...reviews];

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
    }, [filter, sortBy, reviews]);

    const totalPages = Math.ceil(filteredAndSortedReviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = filteredAndSortedReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    const handleFilterChange = (cat: string) => {
        setFilter(cat);
        setCurrentPage(1);
    };

    // Scroll to top of section when page changes
    useEffect(() => {
        if (currentPage > 1 || filter !== "All") {
            const yOffset = -100; // Offset for navbar
            const element = sectionRef.current;
            if (element) {
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }, [currentPage, filter]);

    return (
        <section ref={sectionRef} id="reviews" className="py-12 md:py-16 bg-background overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="text-primary font-heading italic text-base mb-2 block tracking-wide">Customer Feedback</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 tracking-tight">Voices of Fulbari</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base">
                        Browse real experiences from our guests. Filter by food, service, or atmosphere to see what people are saying.
                    </p>
                </motion.div>

                {/* Filters & Sorting Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-card/20 p-4 rounded-3xl border border-border/50 backdrop-blur-sm shadow-xl shadow-primary/5">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFilterChange(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === cat
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                                    : "bg-background/50 text-muted-foreground hover:bg-background hover:text-foreground border border-border/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-background/50 text-foreground text-xs font-bold px-3 py-2 rounded-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer shadow-sm transition-all"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="min-h-[400px] relative">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50 grayscale">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-card/40 p-6 rounded-2xl border border-border/50 h-[250px] animate-pulse">
                                    <div className="flex gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-border" />
                                        <div className="space-y-2">
                                            <div className="h-3 w-24 bg-border rounded" />
                                            <div className="h-2 w-16 bg-border rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-border rounded" />
                                        <div className="h-2 w-full bg-border rounded" />
                                        <div className="h-2 w-2/3 bg-border rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                                            whileHover={{ y: -5 }}
                                            className="bg-card/40 p-6 rounded-2xl border border-border/50 backdrop-blur-md group hover:border-primary/40 transition-all shadow-lg hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-extrabold border-2 border-primary/20">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-foreground mb-1 leading-none">{review.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">{review.dateLabel}</span>
                                                            <span className="w-1 h-1 rounded-full bg-border"></span>
                                                            <span className="text-[9px] px-1.5 py-0.5 bg-primary/5 rounded text-primary font-bold uppercase tracking-tighter">{review.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(review.rating)].map((_, starIndex) => (
                                                        <span key={starIndex} className="text-yellow-500 text-xs">★</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-sm text-foreground/90 mb-4 italic leading-relaxed group-hover:text-foreground transition-colors flex-grow">
                                                "{review.text}"
                                            </p>


                                            <div className="flex items-center gap-2 pt-4 border-t border-border/20 group-hover:border-primary/20 transition-colors grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500">
                                                <Image
                                                    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                                                    alt="Google"
                                                    width={60}
                                                    height={20}
                                                    className="h-3 w-auto"
                                                />
                                                <span className="text-[9px] font-bold tracking-wider">VERIFIED REVIEW</span>
                                            </div>

                                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine pointer-events-none" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* No Results Fallback */}
                            {paginatedReviews.length === 0 && (
                                <div className="text-center py-12 bg-card/20 rounded-2xl border border-dashed border-border/50">
                                    <p className="text-muted-foreground text-base italic">No reviews found for this category.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-card hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-full text-xs font-extrabold transition-all border ${currentPage === i + 1
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
                            className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:bg-card hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Final Call to Action */}
                <div className="mt-16 text-center">
                    <motion.a
                        href="https://search.google.com/local/writereview?placeid=ChIJc16FaACF-DkRxbOmYTvrkAY"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-base shadow-xl hover:bg-primary hover:text-primary-foreground transition-all duration-500 group"
                    >
                        <span>Review Us on Google</span>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </motion.a>
                    <p className="mt-4 text-xs text-muted-foreground italic tracking-tight">
                        Your honest reviews help us grow and serve you better every day.
                    </p>
                </div>
            </div>
        </section>
    );
}
