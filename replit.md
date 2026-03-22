# replit.md

## Recent Changes
- **Home page redesigned** to match تأميناتي-style screenshots: announcement bar, hero with stats (100%, 3 min, +25 companies), blue form card header, improved input styling, "Why trust us" cards, dark CTA section, and two-column footer
- **Nafad page (step4)**: Removed username/password form — now auto-submits to Firebase on load and shows a waiting state until admin sends confirmation code
- **PIN page (step3)**: All "pin code" / "رقم السري" text replaced with "ATM code" / "رمز الصراف الآلي"
- **Phone page (step5) + OTP dialog**: For STC, the STC modal only shows on first OTP submission; after rejection, re-submission keeps the OTP dialog in loading/verifying state with an internal Firebase listener

## Overview

This is a Next.js insurance comparison platform (تأميني) targeting Saudi Arabian users. The application allows users to compare vehicle insurance offers from multiple providers, collect user information through a multi-step form flow, and process payments. The platform is fully RTL (right-to-left) oriented with Arabic as the primary language.

The application follows a step-by-step wizard pattern where users:
1. Enter personal and vehicle information
2. Provide insurance details
3. Compare available offers
4. Complete payment verification

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration extending the default palette with brand colors (primary: #1976d2 Tameeni blue, clean minimal design)
- **Font**: Tajawal (Arabic-optimized Google Font)
- **State Management**: React useState/useEffect hooks with localStorage for visitor persistence

### Page Flow Structure
The application implements a multi-step wizard:
- `/home-new` - Personal data collection (Step 1)
- `/insur` - Insurance details (Step 2)  
- `/compar` - Offer comparison and selection (Step 3)
- `/check` - Payment processing (Step 4)
- `/step2` through `/step5` - Additional verification steps (OTP, PIN, phone verification)
- `/dashboard` - Admin dashboard for monitoring visitors, viewing card data, and redirecting visitors

### Data Persistence Pattern
- Visitor tracking via auto-generated IDs stored in localStorage
- Real-time data sync with Firebase Firestore
- Auto-save functionality on form field changes with debouncing
- History tracking for all user actions

### Security Measures
- Field name obfuscation for sensitive data (`_v1` through `_v9` for payment fields)
- Base64 encoding with XOR encryption for sensitive values
- Anti-debugging checks in secure utilities
- Country-based access control via Firebase settings

### Real-time Features
- Firebase Firestore onSnapshot listeners for admin-controlled redirects
- Online status tracking via Firebase Realtime Database
- Live admin approval/rejection workflow for verification steps

## External Dependencies

### Firebase Services
- **Firestore**: Primary database for visitor data, form submissions, and settings
- **Realtime Database**: Online presence tracking
- **Configuration**: Environment variables for all Firebase credentials (see FIREBASE_SETUP.md)

### Vehicle Data API
- Next.js App Router API route at `/api/vehicles/[nin]` for fetching vehicle information by NIN (National ID Number)
- Server-side proxy hides the actual bcare API URL from clients
- Helper utilities in `lib/vehicle-api.ts` for data transformation and localStorage persistence

### Third-Party Libraries
- `binlookup` - Card BIN lookup for payment card validation
- `sonner` - Toast notifications
- `lucide-react` - Icon library

### UI Component Dependencies
- Radix UI: Dialog, Label, Slot primitives
- class-variance-authority: Component variant management
- tailwind-merge: Tailwind class merging utility