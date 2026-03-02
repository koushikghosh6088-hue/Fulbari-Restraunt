"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        name: "Rohan Das",
        role: "Food Blogger",
        content: "The best Bengali cuisine I've had in a long time. The Hilsa curry was absolutely divine!",
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Local Guide",
        content: "Beautiful ambiance and excellent service. The balcony view in the evening is magical.",
    },
    {
        id: 3,
        name: "Amit Ghosh",
        role: "Regular Customer",
        content: "A perfect place for family dinner. The staff is courteous and the food is always fresh.",
    }
];

export function Testimonials() {
    return (
        <section className="py-12 md:py-20 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8 md:mb-16"
                >
                    <span className="text-primary font-heading italic text-base md:text-lg mb-2 block">Testimonials</span>
                    <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold font-heading mb-4">What Our Customers Say</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ y: -6 }}
                            className="bg-card p-5 md:p-8 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-colors relative"
                        >
                            <Quote className="absolute top-5 right-5 md:top-8 md:right-8 text-primary/20" size={32} />

                            <p className="text-muted-foreground mb-6 md:mb-8 relative z-10 italic text-sm md:text-base">&quot;{item.content}&quot;</p>

                            <div>
                                <h4 className="font-bold text-foreground text-sm md:text-base">{item.name}</h4>
                                <span className="text-xs md:text-sm text-primary">{item.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
