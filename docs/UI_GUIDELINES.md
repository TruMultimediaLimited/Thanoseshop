# UI Guidelines — Thanos E-Shop Design System

The visual language: deep navy page (owner picked it from their reference —
softer than pure black, dark enough for the red/silver wordmark) with white
cards on top, flame-orange primary. Inspiration only from Codashop/
SEAGM-class sites — never copied.

## Color tokens (`:root` is the active theme; `app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--background` | `#10141F` | Deep navy page background |
| `--foreground` | `#F2F3F5` | Near-white text on the navy page |
| `--card` / `--popover` | `#FFFFFF` (dark text) | White cards/menus — the reference's label-panel look |
| `--secondary` | `#EEF0F3` | On-card surfaces, hovers inside white contexts |
| `--muted` | `#171C2A` | Page-level muted surfaces (image placeholders) |
| `--muted-foreground` | `#7E8695` | Muted text — tuned to read on BOTH navy and white |
| `--primary` | `#FF6A00` | Primary actions, links, focus ring |
| `--accent` | `#FFC107` | Gold — badges (Best Seller), stars only |
| `--success` / `--destructive` | `#16A34A` / `#DC2626` | States |
| `--border` / `--input` | mid-gray @ 32% / 55% | Visible on both navy and white |

Bars: header + bottom nav are navy glass (`bg-[#161a28]/90` + blur +
`border-white/10`); bottom-nav inactive ink is `text-white/60` (hardcoded —
tokens describe on-card ink).

Rule: **gold (`accent`) is decorative** — badges/stars/highlights. Interactive
hover states use `secondary`, never gold.

## Components

- **Buttons** (`components/ui/button.tsx`): `default` = orange bg + white
  text; `secondary` = dark bg + orange border + orange text; `ghost` =
  transparent, neutral hover. All have `active:scale-[0.98]`.
- **Cards**: `#1F1F1F`, rounded-xl, soft shadow, subtle border; hover accents
  via `group-hover:border-primary/50` at call sites.
- **Inputs**: h-10, rounded-lg, orange focus ring, ≥16px font on mobile.
- **Icons**: Lucide only (one inline WhatsApp brand SVG in Header/Footer —
  Lucide has no brand glyphs).
- **Boxed header buttons**: shared `BOX_BTN` const in
  `components/layout/Header.tsx` — size-9, rounded-lg, border, `bg-card`.

## Motion

CSS transitions only, ≤300ms (colors, transform). No animation library.

## Layout

- Max content width `max-w-7xl`; page padding `px-4 sm:px-6 lg:px-8`.
- 8px-friendly spacing: section gaps `gap-12`, card padding p-3/p-6.
- Header (all viewports): centered logo only, inside a black pill on the
  white bar; sticky with the announcement bar. Primary navigation is the
  fixed bottom tab bar (Home/FAQ/Cart/Profile); WhatsApp is a floating
  button above it.
- Typography: Geist Sans; headings `font-semibold tracking-tight`; body
  `text-sm`/`text-base`; muted secondary text.

## Accessibility

aria-labels on all icon-only buttons, focus-visible rings everywhere
(`--ring` orange), keyboard-reachable menus (Radix), alt text on images.
