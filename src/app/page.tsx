"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/home/Hero";

// Dynamic imports for below-the-fold sections to improve initial load speed
const TodaysMenuAndEvents = dynamic(() => import("@/components/sections/home/TodaysMenuAndEvents").then(mod => mod.TodaysMenuAndEvents), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-card/20 rounded-3xl my-8" />
});

const About = dynamic(() => import("@/components/sections/home/About").then(mod => mod.About), {
  ssr: false,
  loading: () => <div className="h-screen w-full animate-pulse bg-background/50" />
});

const Specialties = dynamic(() => import("@/components/sections/home/Specialties").then(mod => mod.Specialties), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-card/10 rounded-3xl my-8" />
});

const SocialLinksBar = dynamic(() => import("@/components/sections/home/SocialLinksBar").then(mod => mod.SocialLinksBar), {
  ssr: false
});

const GoogleReviews = dynamic(() => import("@/components/sections/home/GoogleReviews").then(mod => mod.GoogleReviews), {
  ssr: false
});

const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => mod.Footer), {
  ssr: true
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SocialLinksBar />
        <TodaysMenuAndEvents />
        <About />
        <Specialties />
        <GoogleReviews />
      </main>
      <Footer />
    </div>
  );
}




