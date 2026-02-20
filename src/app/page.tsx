import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/home/Hero";
import { TopFlavours } from "@/components/sections/home/TopFlavours";
import { About } from "@/components/sections/home/About";
import { Specialties } from "@/components/sections/home/Specialties";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { ReservationCTA } from "@/components/sections/home/ReservationSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TopFlavours />
        <About />
        <Specialties />
        <Testimonials />
        <ReservationCTA />
      </main>
      <Footer />
    </div>
  );
}
