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
                {/* Image container - full width, seamless */}
                <div className="relative w-full pt-16">
                    <Image
                        src="/hero-bg.jpg"
                        alt="Fulbari Restaurant Exterior Night View"
                        width={1920}
                        height={1080}
                        className="w-full h-auto"
                        priority
                    />
                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
                </div>

                {/* Desktop Text - Below the image */}
                <div className="container mx-auto px-6 pb-16 -mt-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-2xl text-left"
                    >
                        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                            Experience <span className="text-primary">Authentic</span> <br />
                            Flavors & Ambiance
                        </h1>
                        <p className="text-primary font-bengali italic text-xl lg:text-2xl mb-6 tracking-wide drop-shadow-sm">
                            ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                        </p>
                        <p className="text-muted-foreground text-base lg:text-lg mb-8 font-light max-w-lg">
                            A perfect blend of traditional Bengali cuisine and modern dining in the heart of Serampore.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/menu">
                                <Button size="lg" className="min-w-[150px] text-sm">
                                    View Menu
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ===== MOBILE HERO (below md) ===== */}
            <div className="md:hidden">
                {/* Full image at natural aspect ratio */}
                <div className="relative w-full pt-11">
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
                    <h1 className="font-heading text-2xl font-bold text-foreground mb-3 leading-tight">
                        Experience <span className="text-primary">Authentic</span> <br />
                        Flavors & Ambiance
                    </h1>
                    <p className="text-primary font-bengali italic text-base mb-4 drop-shadow-sm">
                        ফুলবাড়ি রেস্তোরাঁ: প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                    </p>
                    <p className="text-muted-foreground text-xs mb-5 font-light max-w-md">
                        A perfect blend of traditional Bengali cuisine and modern dining in the heart of Serampore.
                    </p>
                    <div className="flex gap-3">
                        <Link href="/menu">
                            <Button size="lg" className="min-w-[130px] text-sm">
                                View Menu
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
