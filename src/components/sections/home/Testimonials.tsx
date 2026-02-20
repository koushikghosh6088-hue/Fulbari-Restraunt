"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Rohan Das",
        role: "Food Blogger",
        content: "The best Bengali cuisine I've had in a long time. The Hilsa curry was absolutely divine!",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Local Guide",
        content: "Beautiful ambiance and excellent service. The balcony view in the evening is magical.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Amit Ghosh",
        role: "Regular Customer",
        content: "A perfect place for family dinner. The staff is courteous and the food is always fresh.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop"
    }
];

export function Testimonials() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-heading italic text-lg mb-2 block">Testimonials</span>
                    <h2 className="text-2xl md:text-4xl font-bold font-heading mb-4">What Our Customers Say</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ y: -6 }}
                            className="bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-colors relative"
                        >
                            <Quote className="absolute top-8 right-8 text-primary/20" size={36} />

                            <p className="text-muted-foreground mb-8 relative z-10 italic text-base">"{item.content}"</p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-primary/50">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">{item.name}</h4>
                                    <span className="text-sm text-primary">{item.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
