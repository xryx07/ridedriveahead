---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop interfaces. Covers design styles, color palettes, typography, accessibility (WCAG), interaction design, responsive layouts, animations, and pre-delivery quality checklists."
---

# UI/UX Pro Max — Design Intelligence

Comprehensive design intelligence system based on 79 design styles, 192 product palettes, 74 font pairings, and 119 UX guidelines.

## Rule Priority Hierarchy (1 → 10)

| Priority | Category | Impact | Must-Haves (Key Checks) | Anti-Patterns (Avoid) |
|---|---|---|---|---|
| **1** | **Accessibility** | **CRITICAL** | Contrast $\ge$ 4.5:1 (normal text), 3:1 (large text/icons); visible focus rings (2-4px); descriptive aria-labels; keyboard navigation (logical tab order); heading hierarchy (h1 $\to$ h6); non-color status cues | Removing focus outlines; icon-only buttons without aria-label; low-contrast gray-on-gray; color-only indicators |
| **2** | **Touch & Interaction** | **CRITICAL** | Min touch target 44×44pt (iOS) / 48×48dp (Android); 8px+ spacing between targets; `cursor: pointer` on all clickables; visual press feedback (80-150ms); disabled state clarity | Unresponsive clicks; hover-only critical actions; instant state changes (0ms); cramped tap targets |
| **3** | **Performance** | **HIGH** | WebP/AVIF images; declare aspect-ratio / width-height to prevent CLS (< 0.1); lazy load below fold; pure SVGs over heavy assets; input latency < 100ms | Cumulative layout shift; layout thrashing; bloated external assets; heavy blocking spinners |
| **4** | **Style Selection** | **HIGH** | Match style to industry/product (Mobility/Enterprise: clean, bold, structured, subtle elevation); SVG vector icons (no emojis for system UI); platform-native idioms | Random style mixing (flat + skeuomorphic); emojis as UI icons; AI-generated neon clutter |
| **5** | **Layout & Responsive** | **HIGH** | Mobile-first breakpoints (375px, 768px, 1024px, 1440px); viewport meta (`width=device-width, initial-scale=1`); zero horizontal scroll; 4pt/8pt spacing scale; safe area offsets | Horizontal overflow; fixed container widths in px; disabling user zoom; clipped text/badges |
| **6** | **Typography & Color** | **MEDIUM** | Base text 16px; line-height 1.5; 60-30-10 color rule (60% bg, 30% surface, 10% or 5% accent); semantic CSS tokens; font pairings with clear hierarchy | Body text < 12px; raw hardcoded hex codes across components; excessive font families |
| **7** | **Animation** | **MEDIUM** | Context-aware timing (150-300ms cubic-bezier); meaningful transitions; spatial continuity; `prefers-reduced-motion` media query support | Generic same duration for everything; animating width/height directly (causes reflow); jarring loops |
| **8** | **Forms & Feedback** | **MEDIUM** | Clear persistent labels; inline validation placed directly next to fields; helper text; progressive disclosure; clear disabled/loading buttons | Placeholder-only labels; global-only error banners at top of page; exposing all complexity upfront |
| **9** | **Navigation Patterns** | **HIGH** | Predictable back navigation; bottom nav $\le$ 5 tabs; deep linking; sticky header with subtle backdrop-blur and active state highlight | Overloaded navigation; ambiguous active tabs; broken back state |
| **10** | **Charts & Data** | **LOW** | Clear legends; interactive tooltips; accessible distinct colors; dual cues (shape/pattern + color) | Relying on color alone to differentiate data series |

---

## Pre-Delivery Quality Checklist

Before finalizing any UI/UX deliverable, verify:
- [ ] **No Emojis as UI/System Icons**: Use clean vector SVGs (Lucide, Heroicons) instead of emojis (🚕, 📍, 🔍, 🌙).
- [ ] **`cursor: pointer`**: Present on all buttons, links, cards, tabs, and toggles.
- [ ] **Contrast Compliance**: Light & Dark mode text contrast $\ge$ 4.5:1 against adjacent backgrounds.
- [ ] **Focus Rings**: Keyboard navigation shows clear `:focus-visible` outline/ring.
- [ ] **Zero Layout Shifts**: Heights and aspect ratios are reserved for maps, images, and async widgets.
- [ ] **Responsive Reflow**: Clean layout across 375px, 768px, 1024px, 1440px without horizontal overflow.
- [ ] **Touch Target Size**: Interactive elements have $\ge 44 \times 44$px clickable bounds.
- [ ] **Motion Polish**: Animations use subtle easing and respect `@media (prefers-reduced-motion: reduce)`.
