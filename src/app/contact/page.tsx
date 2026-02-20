"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=2069&auto=format&fit=crop"
                        alt="Restaurant interior"
                        fill
                        className="object-cover opacity-15"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <h1 className="text-2xl md:text-4xl font-bold font-heading mb-3 text-foreground">Contact Us</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                        We'd love to hear from you. Find us, call us, or send a message.
                    </p>
                </motion.div>
            </section>

            <section className="container mx-auto px-4 py-16 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: Phone, title: "Phone", content: "+91 98765 43210", sub: "Mon-Sun from 11am" },
                            { icon: Mail, title: "Email", content: "info@fulbarirestaurant.com", sub: "Online support" },
                            { icon: MapPin, title: "Location", content: "123 Station Road, Serampore", sub: "Hooghly, West Bengal 712201" },
                            { icon: Clock, title: "Opening Hours", content: "11:00 AM - 10:00 PM", sub: "Every Day" },
                        ].map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-foreground font-medium">{item.content}</p>
                                    <p className="text-muted-foreground text-sm">{item.sub}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Map Embed */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="rounded-2xl overflow-hidden border border-border h-[400px] lg:h-auto"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14725.7533604856!2d88.3392435!3d22.7523178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89a8342407995%3A0x6b6851610e7fc95e!2sSerampore%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
