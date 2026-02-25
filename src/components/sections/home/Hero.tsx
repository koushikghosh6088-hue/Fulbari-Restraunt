"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative w-full bg-background overflow-hidden">

            {/* ═══════════════════════════════════════════
                DESKTOP  (md and up) — Split screen layout
                Left: big bold text | Right: restaurant photo
            ════════════════════════════════════════════ */}
            <div className="hidden md:flex min-h-screen pt-16">

                {/* LEFT — Text panel */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="flex-1 flex flex-col justify-end pb-0 px-10 lg:px-16 xl:px-24
                               bg-background relative z-10"
                >
                    {/* Bengali tagline */}
                    <p className="text-primary font-bengali-logo font-bold italic
                                  text-base lg:text-lg xl:text-xl mb-4 leading-relaxed">
                        ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                    </p>

                    {/* Main heading */}
                    <h1 className="font-heading font-extrabold leading-[1.1]
                                   text-4xl lg:text-5xl xl:text-6xl
                                   text-foreground mb-6">
                        Experience<br />
                        <span className="text-primary font-black uppercase tracking-tight">Authentic</span><br />
                        Flavors &amp;<br />Ambiance
                    </h1>

                    {/* Divider */}
                    <div className="w-16 h-1 rounded-full bg-primary mb-8" />

                    {/* Description */}
                    <p className="text-muted-foreground font-light leading-relaxed
                                  text-sm lg:text-base mb-10 max-w-sm lg:max-w-md">
                        A perfect blend of traditional Bengali cuisine and modern dining in the heart of Serampore.
                        Come for the food, stay for the view.
                    </p>


                    {/* CTAs */}
                    <div className="flex gap-4">
                        <Link href="/menu">
                            <Button size="lg"
                                className="px-8 lg:px-10 text-sm lg:text-base shadow-lg shadow-primary/25">
                                View Menu
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline"
                                className="px-8 lg:px-10 text-sm lg:text-base">
                                Book a Table
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* RIGHT — Restaurant photo */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className="relative w-[55%] xl:w-[60%] shrink-0"
                >
                    <Image
                        src="/hero-bg.jpg"
                        alt="Fulbari Restaurant Exterior Night View"
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover object-center"
                        priority
                    />
                    {/* Left-edge fade into text panel */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
                </motion.div>
            </div>

            {/* ═════════════════════════════════════════
                MOBILE  (below md) — Stacked layout
                Image on top, text below (user-approved)
            ══════════════════════════════════════════ */}
            <div className="md:hidden">
                <div className="relative w-full pt-14">
                    <Image
                        src="/hero-bg.jpg"
                        alt="Fulbari Restaurant Exterior Night View"
                        width={1024}
                        height={768}
                        className="w-full h-auto"
                        priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="px-5 pb-10 -mt-6 relative z-10"
                >
                    <p className="text-primary font-bengali-logo font-bold italic text-xs mb-2">
                        ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                    </p>
                    <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2 leading-tight">
                        Experience <span className="text-primary">Authentic</span><br />
                        Flavors &amp; Ambiance
                    </h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-5 font-light max-w-md">
                        A perfect blend of traditional Bengali cuisine and modern dining in the heart of Serampore.
                    </p>
                    <div className="flex gap-3">
                        <Link href="/menu" className="flex-1">
                            <Button className="w-full text-[13px] font-bold shadow-lg shadow-primary/20">
                                View Menu
                            </Button>
                        </Link>
                        <Link href="/contact" className="flex-1">
                            <Button variant="outline" className="w-full text-[13px] font-bold">
                                Book Table
                            </Button>
                        </Link>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
