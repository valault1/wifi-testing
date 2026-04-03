# signalScape Context for Agents

**Purpose**: `signalScape` is the flagship, premium mobile application for Wifi Guys technicians to use on-site. It completely replaces `signal_tester`. 
**Goal**: Walk around a house, test wifi signal and high-speed internet speeds per room, catalog job details, and export a beautiful PDF to hand to the customer.

## Architecture & Constraints
- **Framework**: `Expo` (React Native). We are using Custom Dev Clients because we require native code from `react-native-wifi-reborn`. Do not try to run this in standard Expo Go.
- **Navigation**: We use a custom, lightweight `<TabBar />` inside `App.js` instead of React Navigation. Do not add React Navigation dependencies. Keep it simple.
- **State**: Global state (rooms, job details, and settings) lives natively in `App.js` and persists across app restarts using `AsyncStorage`.
- **UI Vibes**: Premium, clean, "Pro" aesthetics. Deep blues (`#0066FF`), emerald greens for success (`#10B981`), and modern rounded cards with subtle drop shadows.

## Tech Stack specifics
- **Speedtest**: Lives in `src/engines/providers.js`. We use a custom XHR multi-CDN peak-capturing engine, and optionally Fast.com, both executed via hidden `<WebView>`.
- **Wifi Scanning**: `react-native-wifi-reborn` (requires Android Location Permissions).
- **PDF Generation**: `expo-print` constructs a customized HTML document injecting the React state, mapping dBm to visual "bars". `expo-sharing` provides the share dialog.

## Future Agents
- If modifying the WebView speedtest inject, thoroughly test the `pollJs` and make sure you do not break the React Native postMessage bridge (`window.ReactNativeWebView.postMessage`).
- Avoid adding new heavy dependencies unless explicitly requested. Everything is custom-built here to avoid over-engineering.
