# Agent Knowledge & Instructions

**Wait! Before starting any new work on this project, read this file.**

This document serves as the primary source of truth for AI agents (and human contributors) working on this project. 

## Core Directives for Agents
1. **Continuous Documentation:** Whenever you are given new context about how this software is being used, how customers are interacting with it, or high-level goals/needs, you MUST log a concise summary of that understanding here or in the specific agent file for that component.
2. **Keep It Brief & Point to Specifics:** Do not let this root file become long-winded. High-level architecture and overall goals live here. Specific implementation details, context, and rules should live in smaller agent files located in the specific directories where the relevant code resides (e.g., `src/speedtest_center/AGENT.md`). Provide links to them below.
3. **Clean Up Clutter:** As needs pivot and code is updated, it is YOUR responsibility to proactively remove irrelevant, redundant, or outdated context from this file. 

## High-Level Context
- **Project:** Wifi Installation and Testing Tools ("Wifi Guys")
- **Purpose:** Tools for managing, running, orchestrating, and viewing wifi speedtests and network properties on remote laptops.
- **Customers/Users:** Wifi installation professionals who need to verify their network setups and never think about their Wifi again.

## Sub-Agent / Component Files
*(Agents: Add links to specific agent instruction files in subdirectories here as you create them)*
- *(Example: `src/speedtest_center/backend/SERVER_AGENTS.md`)*
- `website/FRONTEND_AGENTS.md`: Front-end design strategy, design tokens, and functional routing context for the landing pages.

## Current Project Needs & Principles
- Maintain stability and ease of deployment for the remote testing servers.
- The web frontend must look premium, modern, and trustworthy.
- Code should be clean, modular, and easy for future humans/AIs to comprehend.

## Deployment & Infrastructure
- The central Speedtest REST Server targets a remote linux environment running via systemd.
- The Promotional Website ("Wifi Guys") is entirely a static Single Page App deployed via **Firebase Hosting** to the `wifi-guys-testing` project.
