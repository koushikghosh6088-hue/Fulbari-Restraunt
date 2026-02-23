"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-background">

            {/* ===== DESKTOP HERO (md and up) ===== */}
            <div className="hidden md:block">
                {/* Image + overlay container */}
                <div className="relative w-full pt-16">
                    {/* Hero Image */}
                    <Image
                        src="/hero-bg.jpg"
                        alt="Fulbari Restaurant Exterior Night View"
                        width={1920}
                        height={1080}
                        className="w-full max-h-[82vh] object-cover object-center"
                        priority
                    />

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

                    {/* Text - centered vertically, left-aligned, starts after navbar */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="max-w-xl"
                            >
                                <h1 className="font-heading text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                                    Experience <span className="text-primary">Authentic</span> <br />
                                    Flavors &amp; Ambiance
                                </h1>
                                <p className="text-primary font-bengali-logo font-bold italic text-base lg:text-lg xl:text-xl mb-5 tracking-wide drop-shadow-sm">
                                    ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                                </p>
                                <p className="text-white/80 text-sm lg:text-base xl:text-lg mb-8 font-light max-w-md drop-shadow-sm">
                                    A perfect blend of traditional Bengali cuisine and modern dining in the heart of Serampore.
                                </p>
                                <div className="flex gap-4">
                                    <Link href="/menu">
                                        <Button size="lg" className="text-sm px-8 shadow-lg">
                                            View Menu
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button size="lg" variant="outline" className="text-sm px-8 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm shadow-lg">
                                            Book a Table
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE HERO (below md) ===== */}
            <div className="md:hidden">
                {/* Full image at natural aspect ratio */}
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

                {/* Mobile Text below image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="px-5 pb-10 -mt-6 relative z-10"
                >
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
                        Experience <span className="text-primary">Authentic</span> <br />
                        Flavors &amp; Ambiance
                    </h1>
                    <p className="text-primary font-bengali-logo font-bold italic text-sm mb-4 drop-shadow-sm">
                        ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                    </p>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-5 font-light max-w-md">
                        A perfect blend of traditional Bengali cuisine and modern dining in the heart of Serampore.
                    </p>
                    <div className="flex gap-3">
                        <Link href="/menu">
                            <Button size="sm" className="text-sm">
                                View Menu
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="sm" variant="outline" className="text-sm">
                                Book a Table
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
