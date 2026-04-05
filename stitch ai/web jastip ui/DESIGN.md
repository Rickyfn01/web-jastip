```markdown
# Design System: The Digital Concierge

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

In the world of high-end personal shopping, luxury is defined by what is left out as much as what is included. This system moves beyond the "grid-and-container" template of standard e-commerce to create an editorial, VIP experience. We break the template by utilizing **intentional asymmetry**, high-contrast typography scales, and a "Zero-Border" philosophy. Every pixel must feel like a deliberate choice by an 'insider' at MAP Group—authoritative, minimalist, and deeply premium.

The visual language borrows from the "Monolithic Modernism" of Apple and the "Editorial Brutalism" of high-fashion labels like Zara. It prioritizes a mobile-first flow where content is presented as a curated collection rather than a chaotic marketplace.

---

## 2. Colors: Tonal Depth over Borders
The palette is a sophisticated interplay of deep obsidian and metallic accents. It relies on the concept of "Physicality in Digital Space."

*   **Primary (`#e9c349`):** Our "Metallic Gold." Use this sparingly for high-value CTAs, VIP badges, and active states. It represents the "Gold Standard" of the service.
*   **Secondary (`#8d94ff`):** A sophisticated "Deep Navy" influence used for subtle highlights or secondary interactive elements.
*   **Tertiary (`#f9f9f9`):** Our "Pure White." Used for high-contrast text on dark backgrounds or as the primary surface in "Light Mode" contexts to provide maximum breathing room.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through:
1.  **Background Color Shifts:** A `surface-container-low` (`#131313`) card sitting on a `surface` (`#0e0e0e`) background.
2.  **Ample Whitespace:** Using the spacing scale to create psychological separation.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked fine papers. Use the `surface-container` tiers to create depth:
*   **Background (`#0e0e0e`):** The base canvas.
*   **Surface-Container-Low (`#131313`):** For large section backgrounds (e.g., the "How it Works" section).
*   **Surface-Container-Highest (`#262626`):** For interactive cards and floating elements.

### Glassmorphism & Signature Textures
For floating navigation bars or mobile overlays, use `surface-variant` (`#262626`) at 70% opacity with a `24px` backdrop-blur. This creates a "frosted obsidian" effect that feels high-end and integrated.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font strategy to balance authority with modernism.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Bold, large-scale headlines (using `display-lg` at 3.5rem) should be used to create an "Editorial Cover" feel.
*   **Body & Labels (Inter):** The workhorse of high-end tech. Inter provides extreme legibility at small sizes (`body-sm` at 0.75rem), essential for a mobile-first premium service.

**Typography as Brand:** Use `letter-spacing: -0.02em` for headlines to create a "tight," professional look. Use `uppercase` with `letter-spacing: 0.1em` for `label-md` elements to signify brand names or category tags (e.g., "ZARA", "SEPHORA").

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often too "muddy" for a Zara-style aesthetic. Instead, we use **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by placing a `surface-container-lowest` (`#000000`) element inside a `surface-container-high` (`#1f1f1f`) area. This creates a "recessed" or "lifted" look through contrast alone.
*   **Ambient Shadows:** If a floating action button (FAB) or modal requires a shadow, use a large blur (40px+) at 8% opacity using the `on-surface` color. It should feel like a soft glow of light, not a shadow.
*   **The "Ghost Border" Fallback:** For input fields, use the `outline-variant` (`#484848`) at 20% opacity. This creates a "suggested" boundary that doesn't clutter the minimalist aesthetic.

---

## 5. Components: Luxury Primitives

### Buttons (Sharp & Precise)
*   **Corner Radius:** `0px` (Strictly). High-end luxury avoids "friendly" rounded corners.
*   **Primary:** `primary` (`#e9c349`) background with `on-primary` (`#4f3e00`) text. Use for "Request Item" or "Checkout."
*   **Secondary:** `surface-container-highest` background with `tertiary` text.
*   **Tertiary:** Ghost style. No background, `on-surface` text with an underline on hover.

### Cards & Lists
*   **Separation:** Forbid divider lines. Use `16px` or `24px` of vertical whitespace.
*   **Interaction:** On hover/tap, a card should shift from `surface-container-low` to `surface-container-high`.

### Input Fields
*   **Style:** Underline-only or subtle "Ghost Border" (20% opacity).
*   **Focus State:** The underline transitions to `primary` (Gold). Helper text should be in `label-sm`.

### VIP Status Chips
*   **Selection Chips:** Use `secondary_container` with `on_secondary_container` text. These should feel like small, silk-woven labels.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use "Aggressive Whitespace." If you think there is enough space, add 16px more.
*   **DO** use intentional asymmetry. Align a headline to the left and the subtext to the right to create an editorial layout.
*   **DO** use high-quality, desaturated photography. Images should feel like a professional photoshoot, not a stock gallery.
*   **DO** ensure all text meets WCAG 2.1 contrast ratios, especially when using Gold accents on Dark backgrounds.

### Don't:
*   **DON'T** use any border-radius. This system is "Brutalist-Modern"; everything is sharp, 90-degree angles.
*   **DON'T** use generic icons. Use thin-stroke (1px or 1.5px) custom iconography that matches the weight of the Inter typeface.
*   **DON'T** use standard blue for links. Use the `primary` Gold or `secondary` Navy.
*   **DON'T** clutter the mobile screen. Show one primary message or one curated item at a time. High-end is about focus.

---

## 7. Director's Closing Note
This design system is not a kit of parts; it is a philosophy of restraint. As a junior designer, your challenge is to resist the urge to fill space. Let the typography breathe, let the tonal shifts define the structure, and let the Gold accents guide the user to the "Insider" experience. If it looks like a generic app, you've used too many lines. If it looks like a magazine, you're on the right track.```