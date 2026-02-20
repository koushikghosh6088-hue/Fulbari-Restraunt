"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function ReservationCTA() {
    return (
        <section className="py-24 relative overflow-hidden text-center">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                    alt="Restaurant ambiance"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/70" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-primary font-heading italic text-lg mb-3 block">Book A Table</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-5 max-w-3xl mx-auto text-white">
                        Ready to Experience Distinctive Taste?
                    </h2>
                    <p className="text-white/70 text-base md:text-lg mb-8 max-w-2xl mx-auto">
                        Reserve your table now and enjoy an unforgettable evening with family and friends.
                    </p>
                    <Link href="/reservation">
                        <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 animate-pulse-slow">
                            Make A Reservation
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
