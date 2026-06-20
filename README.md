# Handoff: Bailamos! Marketing Site

## Overview
A single-page marketing / pre-launch website for **Bailamos!**, a mobile app that helps social dancers find salsa / bachata / kizomba socials, classes, and events on a live map — at home or while traveling. The site dramatizes the core problem (events are scattered across Facebook groups and Instagram stories, impossible to find in a new city), introduces the app with real screenshots, lists live & upcoming cities, pitches promoters/DJs/instructors, tells the founder's story, and captures **waitlist signups** (the primary conversion goal — the app is pre-launch, "Coming soon" on both App Store and Google Play).

Tagline: **"Built by dancers, for dancers."** Currently launching first in **Los Angeles**.

## About the Design Files
The files in this bundle are a **working static-HTML reference implementation** — they show the intended look, copy, and behavior exactly. They are not a framework app. Your task is to **recreate this design in the target environment**:
- If you're standing up a brand-new site, this static HTML/CSS/JS can be **hosted essentially as-is** (see Hosting). That is the fastest path.
- If it should live inside an existing codebase (Next.js, Astro, Vue, etc.), **port the markup and styles into that stack's patterns** — the CSS is plain, token-driven, and framework-agnostic, so it translates cleanly to components.

Either way, treat the HTML as the source of truth for layout, spacing, color, and copy.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions. Recreate pixel-for-pixel. All values are tokenized as CSS custom properties in `site.css` (see Design Tokens).

## Tech & Dependencies
- **Plain HTML + CSS + vanilla JS.** No build step required.
- **Fonts:** Google Fonts — `Instrument Serif` (display) and `Manrope` (body). Loaded via `<link>` in `<head>`. (`Playfair Display` is also linked but no longer used — safe to drop.)
- **Tweaks panel (`tweaks-panel.jsx`, `site-tweaks.jsx`) is a design-time tool only.** It loads React + Babel from unpkg to let a designer flip color themes / hero copy live. **For production, delete those two `<script>` tags + the three React/Babel `<script>` tags + the `#tweaks-root` div, and hardcode `data-direction="clean"` on `<html>`.** The site is fully functional without them. Removing them also removes the only third-party runtime dependency.

## Page Sections (top → bottom)
All sections are centered in a `.wrap` container: `max-width: 1180px; padding: 0 32px`. Section vertical rhythm: `.band { padding: 96px 0 }`. Alternating sections use `.band.alt` (slightly darker paper background).

1. **Sticky nav** — left: logo (CSS-gradient rounded-square mark + "Bailamos!" wordmark in Instrument Serif). Center/right: anchor links (The problem, How it works, Cities, For organizers) + a primary "Get early access" button. Gains a bottom border on scroll (`.nav.scrolled`). Links hidden under 940px.

2. **Hero** — 2-col grid (`1.05fr 0.95fr`), collapses to 1-col under 940px (phone moves above copy).
   - Left: eyebrow "Built by dancers, for dancers"; H1 "Find your floor, **anywhere you are.**" (accent on 2nd line); a prominent **launch badge** ("Now launching in **Los Angeles**" — terracotta pill, 1.5px accent border, pulsing dot + map-pin icon); lede paragraph; two buttons ("Get early access" primary → opens waitlist, "See how it works" ghost → #how); proof row (3 letter avatars + "Salsa · Bachata · Kizomba — and every Latin social").
   - Right: floating iPhone frame showing the real **Map** screenshot.

3. **Problem** (`#problem`) — eyebrow + serif H2 + a giant decorative "2". Two cards (`.problems`, 2-col → 1-col): **"You travel — and the floor disappears"** (decorative dashed map pins with "?" marks) and **"No Instagram? You don't exist to the scene"** (CSS mock of locked/blurred social posts). Each card: image-area visual on top, body below (tag, serif H3, paragraph).

4. **Bridge** (`.bridge`) — centered single serif line on alt background: "So we built one honest map of the social-dance world — no Instagram, no Facebook, *just a new way to find dancing.*"

5. **How it works** (`#how`) — centered head + 3 equal columns (`.steps`), each: a phone screenshot (Map, Week List, Event Detail), a numbered accent circle, serif H3, paragraph. (1) Drop into any city (2) See the whole week (3) Show up & dance.

6. **Saved** (`#saved`) — `.feature-grid` (0.92fr / 1.08fr). Left: floating phone with the **Saved** screenshot. Right: eyebrow "Never lose the night", serif H2 "Save the ones you love.", paragraph, and a checklist (`.ticks`) of 3 items.

7. **Cities** (`#cities`, alt bg) — `.cities-grid` (0.92fr / 1.08fr). Left: copy + "Check your city" button (opens waitlist). Right: a **cities panel card** with two tabs ("Live now 2", "Coming soon 1"), rows for **Los Angeles, CA** (Flagship tag) and **San Diego, CA** (both with a "Live" pill), a coming-soon row **New York City, NY** with a "Notify me" button (opens waitlist), and a maroon footer ("Don't see your city? … Request" → opens waitlist).

8. **Creators** (`#creators`) — "For promoters, DJs & instructors". `.creator-grid` (1fr / 1fr). Left: 4 feature blocks (Post in minutes / Get discovered on the map / **See who's coming** *(carries a "Coming soon" badge)* / Keep it current) + a "List your events — it's free" button (opens waitlist preset to the *creator* role). Right: two overlapping phone screenshots (Become a creator + New event).

9. **Our Story** (`#story`, alt bg) — `.story` grid (260px / 1fr). Left: a **small, subtle** square founder photo (`assets/rudy-story.jpg`, 1:1, ~240–260px, rounded, soft shadow) that is `position: sticky` on desktop, with an italic caption "On the floor." Right: eyebrow, a serif blockquote tagline, the multi-paragraph founder story (two short punch-lines rendered in italic serif via `.story-punch`), signed "**Rudy**, Founder. Dancer for 20 years, software engineer for a living."

10. **Final CTA** (`#get`) — maroon rounded panel: eyebrow, serif H2 "Your next floor is almost on the map.", paragraph, "Get early access →" button (opens waitlist), a pulsing "Coming soon" label, two **non-clickable** store badges ("Coming soon to App Store / Google Play"), and a micro line "Launching first in Los Angeles — more cities right behind it."

11. **Footer** (`.foot`) — logo + tagline, three link columns (Product / Community / Company), bottom bar with copyright + dance styles.

12. **Waitlist modal** (`#wlOverlay`) — see Interactions.

## Interactions & Behavior
- **Scroll reveal:** elements with `.reveal` fade/translate in via `IntersectionObserver` (`.reveal.in`). Respects `prefers-reduced-motion`.
- **Sticky nav** toggles `.scrolled` (border) past 12px scroll.
- **Floating phones:** `.shotframe.floatme` gentle 6.5s vertical bob; disabled under reduced-motion.
- **Pulsing dots:** launch badge + "Coming soon" labels use a `pulseDot` keyframe ring.
- **Waitlist modal (`waitlist.js`):**
  - Opens from **any element with `data-waitlist`** (7 triggers across the page). The attribute's value can preset the role — `data-waitlist="creator"` opens with "Creator / Promoter" selected; empty/`"attendee"` defaults to "Dancer / Attendee".
  - Fields: **email** (validated), **city** (required text), **role** (segmented radio: `attendee` | `creator`).
  - Closes on the × button, backdrop click, or Esc; restores focus to the trigger; locks body scroll while open; animated in/out.
  - On submit → POSTs to your endpoint, then shows an inline success state echoing the email + city. Inline error messaging on validation/network failure.
- **Store badges** in the CTA are intentionally non-interactive (`.store.soon`) until launch — swap each `<div class="store soon">` back to an `<a href="…store URL…">` and relabel when live.

## ⭐ Waitlist API Integration (the main thing to wire up)
The front end is done; it needs a backend.

- **Config:** open `waitlist.js`, set `const WAITLIST_ENDPOINT = "https://your-api/waitlist";`. While it's empty, the form **simulates** success and logs the payload to the console (so the UI is demoable without a backend).
- **Request:** `POST` with `Content-Type: application/json`, body `{ "email": string, "city": string, "role": "attendee" | "creator" }`. Rename keys in the `buildPayload()` helper (right below the endpoint constant) if your API differs.
- **Success criterion:** any `res.ok` (2xx). Non-2xx → user sees the error state.
- **CORS:** the endpoint **must** send `Access-Control-Allow-Origin` for the site's domain, or browsers will block the request. If you build the API in the same app/host, prefer a same-origin path (e.g. `/api/waitlist`) to avoid CORS entirely.
- **Suggested storage:** a `waitlist` table/collection with `email`, `city`, `role`, `created_at` (consider a unique constraint on email; basic email validation server-side; optional spam protection / double-opt-in email).

## State Management
Minimal. The only runtime state is the waitlist modal: `open/closed`, the preset `role`, and `form → submitting → success | error`. If porting to React, a single `WaitlistModal` component with `useState` for `{ isOpen, role, status, error }` plus a context/provider (or a simple global open function) for the 7 triggers is sufficient. Everything else is static content.

## Design Tokens
Defined as CSS custom properties in `site.css`. The site ships in the **Clean** theme (`<html data-direction="clean">`); two alternate themes (`editorial`, `nightlife`) also exist as `[data-direction]` overrides but are not used in production.

**Clean theme (production):**
- Backgrounds: `--page #FBFAF7`, `--page-alt #F3F1EB`, `--surface #FFFFFF`, `--surface-2 #F6F4EE`
- Lines: `--line #ECE7DD`, `--line-strong #DFD8CA`
- Text: `--display #20140F`, `--text #20140F`, `--text-soft #52443C`, `--muted #9B8F82`
- Accent (terracotta): `--accent #D8623C`, `--accent-deep #C2502C`, `--accent-soft #F6E2D6`, `--on-accent #FFFFFF`
- Brand extras: `--merlot #5E1B25` (deep maroon, used for the CTA panel + cities footer), `--terra #D8623C`, `--gold #BC8636`, `--sage #5F7A66`

**Typography:**
- Display serif: **Instrument Serif** (`--serif`), used for headlines, wordmark, blockquotes, numbers. Often italic.
- Body / UI: **Manrope** (`--sans`), weights 400–800.
- Headline sizes use `clamp()` (e.g. hero H1 `clamp(48px, 6.2vw, 84px)`, section H2 `clamp(34px, 4.4vw, 56px)`).

**Radii:** `--r-lg 26px`, `--r-md 18px`, `--r-sm 12px`; buttons/pills `999px`.
**Shadows:** `--shadow-card`, `--shadow-soft`, `--shadow-pill` (terracotta glow) — see `:root` in `site.css`.
**Layout:** container `--maxw 1180px`; section padding `96px 0` (72px under 560px); primary breakpoints at **940px** (multi-col → single-col) and **560px** (tighten paddings).

## Assets
All in `assets/`. Real device screenshots (1320×2868) + founder photo.
- `app-map.png` — Discover/Map screen (used in hero + how-it-works step 1)
- `app-week.png` — Week list (step 2)
- `app-detail.png` — Event detail (step 3)
- `app-saved.png` — Saved tab (Saved section)
- `app-creator.png` — Become a creator (Creators section)
- `app-create.png` — New event form (Creators section)
- `rudy-story.jpg` — founder photo (Our Story), 512×512
- The logo mark is pure CSS (gradient + serif "B") — no image needed.
- Icons are inline SVG. No icon library required.

**Screenshots note:** these are real iOS captures, so they're flat rectangles — the rounded "phone" corners come from the frame's `border-radius` + `overflow: hidden` (`.shotframe` / `.shotscreen` in `site.css`), not from the images. For App Store submission, use the flat versions (Apple requires no rounded corners).

## Files (in this bundle)
- `index.html` — the page (renamed from "Bailamos Site.html")
- `site.css` — all styles (tokens, layout, components, phone frames, waitlist modal, responsive)
- `site-screens.js` — injects the screenshots into the phone frames
- `waitlist.js` — waitlist modal logic + **the endpoint you must configure**
- `tweaks-panel.jsx`, `site-tweaks.jsx` — design-time theme toggle (omit in production)
- `assets/` — images listed above

## Hosting
It's a static site — host the contents of this folder on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront). `index.html` is the entry point; references are relative, so no config needed. For the waitlist, either (a) point `WAITLIST_ENDPOINT` at an existing API with CORS enabled, or (b) deploy on a platform with serverless functions (Vercel/Netlify) and add a same-origin `/api/waitlist` handler that writes to your store — then set `WAITLIST_ENDPOINT = "/api/waitlist"`.
