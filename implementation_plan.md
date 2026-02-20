# Implementation Plan - Fulbari Restaurant Website

## Phase 1: Project Initialization & Setup
- [ ] Initialize Next.js project with TypeScript and Tailwind CSS
- [ ] Install dependencies: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`
- [ ] Configure Fonts (Playfair Display, Poppins) in `layout.tsx`
- [ ] Configure Tailwind theme (Colors: Dark #0f0f0f, Gold accent)
- [ ] Create folder structure (components, sections, lib, hooks)

## Phase 2: Design System & Core Components
- [ ] Create `Button` component (Gold/Outline variants)
- [ ] Create `Section` wrapper (Standard padding/margins)
- [ ] Create `Navbar` (Responsive, Glassmorphism, Logo)
- [ ] Create `Footer` (Links, Contact, Socials)

## Phase 3: Page Implementation
### Home Page
- [ ] **Hero Section:** Full-screen background image, catchy headline, CTA buttons.
- [ ] **Top Flavours:** Grid of circular/square highlights.
- [ ] **About Section:** Text + Image layout (Balcony view).
- [ ] **Specialties:** Featured menu items grid.
- [ ] **Testimonials:** Carousel or grid of reviews.
- [ ] **Reservation CTA:** Full-width strip.

### Menu Page
- [ ] **Category Filter:** Tabs for cuisines (Bengali, Indian, Chinese, etc.).
- [ ] **Menu Grid:** Card components with Image, Title, Description, Price, Veg/Non-veg.
- [ ] **Search:** Real-time search functionality.

### Reservation Page
- [ ] **Form:** Name, Phone, Date, Time, Guests.
- [ ] **Integration:** WhatsApp link generation on submit.

### Gallery Page
- [ ] **Masonry/Grid Layout:** High-quality images.

### Contact Page
- [ ] **Info Cards:** Phone, Address, Email.
- [ ] **Map:** Google Maps Embed.

## Phase 4: Polish & Optimization
- [ ] Implement Smooth Scrolling (Lenis or CSS).
- [ ] Add Scroll Animations (Framer Motion).
- [ ] Responsive Design Check (Mobile/Tablet).
- [ ] SEO Meta Tags & Schema Markup.
