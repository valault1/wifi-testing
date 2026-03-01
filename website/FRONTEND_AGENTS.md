# Frontend Agent Instructions

## Purpose
This directory contains the codebase for the "Wifi Guys" promotional and functional website. The focus here is on delivering a modern, high-converting, premium web experience for potential clients looking for professional wifi installation services.

## Core Directives for Frontend Agents
1. **Design Excellence**: Any frontend updates or new versions must look spectacular. Use beautiful color palettes (primarily deep purples and gradients), sophisticated spacing, and modern typography. 
2. **Animation & Interaction**: Make heavy use of micro-animations (e.g., Lucide icons, hover effects, entrance animations). The site should feel alive but never overwhelming.
3. **Frictionless Conversion**: The user journey must be simple and directly point to taking action (scheduling a consultation, getting in touch, reading example reports). No unnecessary steps or friction.
4. **Clean Code**: Ensure React components are modular and adhere to best practices using TypeScript and JSX/TSX. Retain the single-page application feel with pseudo-routing (hash routing) if full routing is overkill for demo versions.

## Project Structure
- `src/versions/`: We have settled on `Version1.tsx` as the final application structure! Versions 2, 3, and 4 have been entirely deleted to reduce codebase clutter. `App.tsx` directly renders `Version1`.
- `src/styles/`: Contains core CSS styles (e.g., `index.css`) defining variables for colors, typography, shadow utilities, animation keyframes, and global scroll-margin offsets.

## Deployment & Hosting
- **Platform**: Firebase Static Hosting
- **Project ID**: `wifi-guys-testing`
- **Dashboard URL**: [Firebase Console](https://console.firebase.google.com/u/0/project/wifi-guys-testing/hosting/sites/wifi-guys-testing)
- **Live URL**: https://wifi-guys-testing.web.app
- **Build/Deploy**: Run `bun run build` followed by `firebase deploy --only hosting`.

## Recent Context
We heavily iterated on `Version1` and have finalized its core structure. Key features include:
- A dedicated Contact page route with specific forms and direct call/text buttons.
- A functional Process summary view with 8 detailed steps.
- A functional Coverage view showcasing a sample site assessment report.
- An interactive FAQ built with smooth expanding accordions.
- An "About Us" page detailing the founders' authentic story and Memphis roots.
- Dynamic pricing cards that clearly communicate transparency ("From $X") and premium service without redundant node-count text.
- Navigation now utilizes hash routing (`#pricing`, `#how-it-works`) with programmatic smooth scrolling that auto-offsets for the sticky header.

*(Agents: Please keep these directives in mind and update this file as the frontend strategy pivots!)*
