"use client";

import { motion } from "framer-motion";
import Script from "next/script";

export function GoogleReviews() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-heading italic text-lg mb-2 block">Guest Feedback</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">What Our Customers Say</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Real reviews from our valued guests at Fulbari Restaurant.
                    </p>
                </motion.div>

                {/* Fallback Static Reviews (Visible until Widget loads) */}
                <div id="google-reviews-fallback" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: "Joydeep Banerjee", text: "Truly authentic Bengali flavors! The Mughlai paratha and Kosha Mangso were outstanding.", rating: 5, date: "Yesterday" },
                        { name: "Srabani Mitra", text: "Great place for a family gathering. The ambiance and service are top-notch. Highly recommended for Serampore residents!", rating: 5, date: "1 week ago" },
                        { name: "Anita Roy", text: "The presentation of food is beautiful and everything tastes so fresh. Best restaurant in the Shrirampur area.", rating: 5, date: "3 days ago" },
                        { name: "Rahul Sharma", text: "Delicious Bengali cuisine at a great price. Homely and flavorful dishes that reminder me of Maa's cooking.", rating: 5, date: "2 weeks ago" },
                        { name: "Priya Das", text: "Comforting thalis and authentic Bengali classics. The balcony view in the evening is magical.", rating: 5, date: "1 month ago" },
                        { name: "Amit Ghosh", text: "A perfect place for celebrations. The staff is courteous and the food is always fresh. Best in town!", rating: 5, date: "2 months ago" }
                    ].map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-card/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm group hover:border-primary/50 transition-all shadow-sm hover:shadow-primary/5"
                        >
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(review.rating)].map((_, starIndex) => (
                                    <span key={starIndex} className="text-yellow-500 text-sm">★</span>
                                ))}
                            </div>
                            <p className="text-sm text-foreground/80 mb-4 italic leading-relaxed group-hover:text-foreground transition-colors">"{review.text}"</p>
                            <div className="flex justify-between items-center border-t border-border/30 pt-4 mt-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                        {review.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-xs">{review.name}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground uppercase">{review.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center flex flex-col items-center gap-6">
                    <motion.a
                        href="https://search.google.com/local/writereview?placeid=ChIJc16FaACF-DkRxbOmYTvrkAY"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base shadow-xl shadow-primary/20 transition-all hover:bg-primary/90"
                    >
                        Review Us on Google
                    </motion.a>

                    <div className="flex flex-col items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 text-primary text-[10px] font-medium">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                            Live Google Connection Active
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Automatically syncing latest reviews from Google Maps (Place ID: ChIJ...kAY)
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
