"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative w-full bg-background">

            {/* ── Full natural-ratio image ──────────────────────────────── */}
            <div className="relative w-full pt-14 md:pt-16">
                <Image
                    src="/hero-bg.jpg"
                    alt="Fulbari Restaurant Exterior Night View"
                    width={1920}
                    height={1080}
                    className="w-full h-auto"
                    priority
                />
                {/* Soft fade at the bottom into the page */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* ── Text content below the image ─────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative z-10 -mt-12 md:-mt-20 lg:-mt-28 xl:-mt-36
                           px-5 md:px-16 lg:px-24 xl:px-40
                           pb-12 md:pb-16"
            >
                <div className="max-w-4xl">
                    {/* Eyebrow */}
                    <p className="text-primary font-bengali-logo font-bold italic
                                  text-sm md:text-lg lg:text-xl xl:text-2xl
                                  mb-3 md:mb-4 leading-relaxed drop-shadow-sm">
                        ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                    </p>

                    {/* Main heading */}
                    <h1 className="font-heading font-extrabold leading-tight
                                   text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                                   text-foreground mb-4 md:mb-6">
                        Experience{" "}
                        <span className="text-primary">Authentic</span>
                        <br className="hidden sm:block" />
                        {" "}Flavors &amp; Ambiance
                    </h1>

                    {/* Description */}
                    <p className="text-muted-foreground font-light leading-relaxed
                                  text-sm md:text-base lg:text-lg xl:text-xl
                                  mb-6 md:mb-8 max-w-xl lg:max-w-2xl">
                        A perfect blend of traditional Bengali cuisine and modern dining in the
                        heart of Serampore. Come for the food, stay for the view.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 md:gap-4">
                        <Link href="/menu">
                            <Button
                                size="lg"
                                className="text-sm md:text-base px-7 md:px-10 py-3 shadow-lg shadow-primary/20"
                            >
                                View Menu
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-sm md:text-base px-7 md:px-10 py-3"
                            >
                                Book a Table
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
