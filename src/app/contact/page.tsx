"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";

export default function ContactPage() {
    const contactInfo = [
        { icon: Phone, title: "Phone", content: "+91 84206 80650", sub: "Mon-Sun from 11am", delay: 0.1 },
        { icon: Mail, title: "Email", content: "info@fulbarirestaurant.com", sub: "Online support", delay: 0.2 },
        { icon: MapPin, title: "Location", content: "Serampore, Hooghly", sub: "West Bengal 712201", delay: 0.3 },
        { icon: Clock, title: "Hours", content: "11:00 AM - 10:00 PM", sub: "Open Every Day", delay: 0.4 },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
            <Navbar />

            <main className="flex-grow pt-20">
                {/* 1. Cinematic Hero Section */}
                <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=2069&auto=format&fit=crop"
                            alt="Fulbari Atmosphere"
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
                        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-primary font-heading text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">Get In Touch</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading tracking-tighter leading-none">
                                Contact <span className="text-primary">Us</span>
                                <span className="block text-2xl md:text-4xl mt-2 font-bengali-logo opacity-80 italic">যোগাযোগ করুন</span>
                            </h1>

                            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium balance mt-6">
                                Whether you're planning a visit or have inquiries about our catering,
                                we're here to provide you with the perfect <span className="text-foreground italic">"Proshantir Neer"</span> experience.
                            </p>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </section>

                {/* 2. Interaction Section */}
                <section className="container mx-auto px-4 py-12 md:py-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                        {/* Left Side: Information Cubes */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {contactInfo.map((item) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: item.delay }}
                                        whileHover={{ y: -5 }}
                                        className="group p-6 rounded-3xl bg-card/40 border border-primary/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 shadow-xl"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                            <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <h3 className="font-heading font-black text-xs uppercase tracking-widest text-primary mb-1">{item.title}</h3>
                                        <p className="text-foreground font-bold text-sm md:text-base leading-tight mb-1">{item.content}</p>
                                        <p className="text-muted-foreground text-[10px] md:text-xs font-medium italic">{item.sub}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Direct Message CTA Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary),0.3)] relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700" />
                                <div className="relative z-10 space-y-4">
                                    <h2 className="text-3xl font-black font-heading leading-none italic">Reservation or <br />Booking?</h2>
                                    <p className="text-primary-foreground/80 text-sm font-medium leading-relaxed">
                                        For larger parties, special events, or catering inquiries, feel free to call us directly for immediate assistance.
                                    </p>
                                    <div className="pt-2">
                                        <a href="tel:+918420680650" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg">
                                            Call Now <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side: Immersive Map Block */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-7 w-full h-[400px] md:h-[550px] relative group"
                        >
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />

                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-card">
                                <div className="absolute inset-0 z-10 pointer-events-none border-[12px] border-primary/5 rounded-[2.5rem]" />
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14725.7533604856!2d88.3392435!3d22.7523178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89a8342407995%3A0x6b6851610e7fc95e!2sSerampore%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="grayscale hover:grayscale-0 transition-all duration-1000 opacity-80 hover:opacity-100 scale-105"
                                />

                                {/* Corner Label */}
                                <div className="absolute bottom-6 left-6 z-20 px-4 py-2 bg-background/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Hooghly, West Bengal</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
