import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-card pt-16 pb-8 border-t border-border">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="relative h-12 w-36 md:h-16 md:w-48">
                                <Image
                                    src="/logo.png"
                                    alt="Fulbari Restaurant Logo"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-muted-foreground mb-3 max-w-xs text-sm">
                            Experience the best of Bengali, Indian, and Chinese cuisine in a premium ambiance. Flavors inspired by tradition.
                        </p>
                        <p className="text-primary font-bengali-logo font-bold italic text-sm mb-8 border-b border-primary/20 pb-2 inline-block">
                            প্রকৃতির সান্নিধ্যে এক অনন্য স্বাদের ঠিকানা
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                                <Twitter size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-5">Quick Links</h3>
                        <ul className="space-y-3">
                            {["Home", "Menu", "Gallery", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-5">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="shrink-0 text-primary mt-1" size={18} />
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-sm">Old Delhi Road, Rajyadharpur,<br />Serampore, Hooghly, West Bengal</span>
                                    <span className="text-primary/70 font-bengali text-[13px] font-semibold tracking-wide">ওল্ড দিল্লি রোড, রাজ্যাধরপুর, শ্রীরামপুর, পশ্চিমবঙ্গ</span>
                                </div>
                            </li>
                            <li className="flex flex-col gap-3 text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <Phone className="shrink-0 text-primary" size={18} />
                                    <span className="text-sm">+91 98765 43210</span>
                                </div>
                                <div className="ml-7 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                                    <span className="text-primary/90 font-bengali font-bold italic text-[11px] tracking-wide">টেবিল বুকিংয়ের জন্য কল করুন: +91 98765 43210</span>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="shrink-0 text-primary" size={18} />
                                <span>info@fulbarirestaurant.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h3 className="font-heading text-lg font-bold text-foreground mb-5">Opening Hours</h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center text-muted-foreground">
                                <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> Mon - Fri</span>
                                <span>11:00 AM - 10:00 PM</span>
                            </li>
                            <li className="flex justify-between items-center text-muted-foreground">
                                <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> Sat - Sun</span>
                                <span>10:00 AM - 11:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Fulbari Restaurant. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
