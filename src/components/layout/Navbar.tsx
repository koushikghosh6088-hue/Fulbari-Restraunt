"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Reservation", href: "/reservation" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-2" : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-center md:justify-between relative">
                {/* Logo - Centered on mobile, left on desktop */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-12 w-32 md:h-16 md:w-48">
                        <Image
                            src="/logo.png"
                            alt="Fulbari Restaurant Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm lg:text-base"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link href="/reservation">
                        <Button size="sm">Book a Table</Button>
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-foreground absolute right-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-background border-b border-border md:hidden flex flex-col items-center py-8 gap-6 shadow-2xl"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-heading font-medium text-foreground hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/reservation" onClick={() => setIsOpen(false)}>
                            <Button className="w-48">Book Now</Button>
                        </Link>

                        <div className="flex flex-col items-center gap-2 mt-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-2">
                                <Phone size={14} /> <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} /> <span>Serampore, Hooghly</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
