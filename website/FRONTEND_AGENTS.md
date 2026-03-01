# Frontend Agent Instructions

## Purpose
This directory contains the codebase for the "Wifi Guys" promotional and functional website. The focus here is on delivering a modern, high-converting, premium web experience for potential clients looking for professional wifi installation services.

## Core Directives for Frontend Agents
1. **Design Excellence**: Any frontend updates or new versions must look spectacular. Use beautiful color palettes (primarily deep purples and gradients), sophisticated spacing, and modern typography. 
2. **Animation & Interaction**: The site is designed to be straightforward and fast. Do not use overly fancy or slow CSS animations. Micro-interactions like button glows are acceptable, but keep it snappy.
3. **Frictionless Conversion**: The user journey must be simple and directly point to taking action (scheduling a consultation, getting in touch, reading example reports). No unnecessary steps or friction.
4. **Clean Code Architecture**: The application uses a modular architecture. Never write monolithic files. Use the `src/components/` and `src/pages/` directories.

## Project Structure
- `src/App.tsx`: The main entry point that handles global state, History API (pathname) routing, and layout wrappers.
- `src/components/`: Reusable, global UI components (e.g., `Header.tsx`, `Footer.tsx`).
- `src/pages/`: Individual page views for the application, loaded dynamically for performance (`Home.tsx`, `Contact.tsx`, `Process.tsx`, `Coverage.tsx`, `Faq.tsx`, `About.tsx`).
- `src/styles/`: Contains core CSS styles (e.g., `index.css`) defining variables for colors, typography, shadow utilities, button glow utilities, and global scroll-margin offsets.

## Deployment & Hosting
- **Platform**: Firebase Static Hosting
- **Project ID**: `wifi-guys-testing`
- **Dashboard URL**: [Firebase Console](https://console.firebase.google.com/u/0/project/wifi-guys-testing/hosting/sites/wifi-guys-testing)
- **Live URL**: https://wifi-guys-testing.web.app
- **Build/Deploy**: Run `bun run build` followed by `firebase deploy --only hosting`.

## Current Features & Context
- A dedicated Contact page route with specific forms and direct call/text buttons.
- A functional Process summary view with 8 detailed steps outlining the "Science of Perfect Wifi".
- A functional Coverage view showcasing a sample site assessment report.
- An interactive FAQ built with smooth expanding accordions.
- An "About Us" page detailing the founders' authentic story and Memphis roots.
- Dynamic pricing cards that clearly communicate transparency without anchoring to low-value tiers.
- Navigation utilizes the native browser History API with clean pathnames (`/about`, `/faq`) which Firebase Hosting handles via single-page application rewrites. Cross-page section jumps still leverage hash links (`/#pricing`, `/#how-it-works`) with programmatic smooth scrolling.
- Pages are lazy-loaded in `App.tsx` using React's `Suspense` to improve initial load performance and keep hosting costs cheap.

*(Agents: Please keep these directives in mind and update this file as the frontend strategy pivots!)*
