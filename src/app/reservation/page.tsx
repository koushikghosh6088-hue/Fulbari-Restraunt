"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, User, MessageSquare } from "lucide-react";

export default function ReservationPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `Hello, I would like to book a table at Fulbari Restaurant.%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0ADate: ${formData.date}%0ATime: ${formData.time}%0AGuests: ${formData.guests}`;
        // Replace with actual restaurant number
        const phoneNumber = "919876543210";
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <section className="flex-grow pt-24 md:pt-32 pb-12 md:pb-20 px-4 container mx-auto flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-6xl">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <span className="text-primary font-heading italic text-lg mb-2">Reservations</span>
                        <h1 className="text-2xl md:text-5xl font-bold font-heading mb-4 md:mb-5 text-foreground">
                            Book Your Table
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base mb-5 md:mb-6 leading-relaxed">
                            Avoid the wait and ensure your spot at the best table in the house.
                            Whether it's a romantic dinner or a large family gathering, we are ready to serve you.
                        </p>

                        {/* Reservation Image */}
                        <div className="relative h-[200px] md:h-[240px] rounded-2xl overflow-hidden mb-6 group">
                            <Image
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
                                alt="Beautiful restaurant interior with table setting"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-primary-foreground text-sm font-medium">
                                    Premium Dining Experience
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 p-6 bg-card rounded-2xl border border-border">
                            <h3 className="text-xl font-bold text-foreground mb-2">Booking Policy</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Please arrive 10 minutes before your scheduled time.</li>
                                <li>Reservations are held for 15 minutes past the booking time.</li>
                                <li>For parties larger than 10, please contact us directly.</li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-card p-6 md:p-10 rounded-3xl shadow-2xl border border-border"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full bg-accent border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-foreground outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">+91</span>
                                    <input
                                        required
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        className="w-full bg-accent border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-foreground outline-none transition-all"
                                        placeholder="98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                        <input
                                            required
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            type="date"
                                            className="w-full bg-accent border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-foreground outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                        <input
                                            required
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            type="time"
                                            className="w-full bg-accent border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-12 pr-4 text-foreground outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Number of Guests</label>
                                <select
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    className="w-full bg-accent border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 px-4 text-foreground outline-none transition-all"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, "8+"].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                                    ))}
                                </select>
                            </div>

                            <Button type="submit" size="lg" className="w-full text-lg h-12 flex items-center justify-center gap-2">
                                <MessageSquare size={20} />
                                Confirm via WhatsApp
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
