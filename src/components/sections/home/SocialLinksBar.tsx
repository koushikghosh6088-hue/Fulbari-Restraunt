"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SocialLinksBar() {
    const socials = [
        {
            name: "Facebook",
            icon: Facebook,
            href: "https://www.facebook.com/share/1CJLS6rvRd/",
            color: "hover:text-[#1877F2]",
            label: "Join our Community",
            count: "5k+"
        },
        {
            name: "Instagram",
            icon: Instagram,
            href: "https://www.instagram.com/fulbarirestora?",
            color: "hover:text-[#E4405F]",
            label: "Follow the Vibe",
            count: "2k+"
        },
        {
            name: "Google Maps",
            icon: Star,
            href: "https://maps.app.goo.gl/kqhpLDput5X6aHDr6",
            color: "hover:text-[#F4B400]",
            label: "Visit Our Location",
            count: "Map"
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="relative z-20 mt-4 md:mt-8 px-2 md:px-4 mb-8 md:mb-12">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 p-3 md:p-6 rounded-3xl md:rounded-full bg-card/40 backdrop-blur-2xl border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-fit md:w-full mx-auto"
                >
                    {/* Brand Tagline */}
                    <motion.div variants={item} className="flex items-center gap-4 px-4 hidden lg:flex">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="font-heading font-black text-xs">FB</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Connect with us</span>
                            <span className="text-xs font-bold text-foreground italic">@fulbarirestora</span>
                        </div>
                    </motion.div>

                    {/* Social Links Container - Strict Row on Mobile */}
                    <div className="flex flex-row justify-center items-center gap-1 sm:gap-3 md:gap-8 flex-1 w-full md:w-auto">
                        {socials.map((social) => (
                            <motion.div key={social.name} variants={item}>
                                <Link
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center gap-2 md:gap-3 px-2 sm:px-4 py-2 rounded-full hover:bg-primary/5 transition-all duration-300 ${social.color}`}
                                >
                                    <div className="relative shrink-0">
                                        <social.icon className="w-5 h-5 md:w-[18px] md:h-[18px] transition-transform group-hover:scale-110" />
                                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-none mb-0.5">{social.name}</span>
                                        <span className="text-[8px] sm:text-[9px] font-medium text-muted-foreground whitespace-nowrap">{social.label}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Button - Hidden on Mobile */}
                    <motion.div variants={item} className="hidden md:block px-2">
                        <Link href="/contact" className="group flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300">
                            Visit Us <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
