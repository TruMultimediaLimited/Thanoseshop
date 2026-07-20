# UI Guidelines — Thanos E-Shop Design System

The visual language pairs the flame-orange brand with a soft light theme
(owner decision: pure black hurt their eyes). Inspiration only from
Codashop/SEAGM-class sites — never copied.

## Color tokens (light = active theme; `app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--background` | `#E9EAEC` | Light gray page background |
| `--foreground` | `#1C1C1E` | Soft black text (never pure #000) |
| `--card` | `#FFFFFF` | Cards, header, bottom bar |
| `--secondary` / `--muted` | `#DFE0E3` | Surfaces, hover states |
| `--primary` | `#E85D00` | Primary actions, links, focus ring |
| `--accent` | `#D69E00` | Gold — badges (Best Seller), stars only |
| `--success` | `#16A34A` | Success states |
| `--destructive` | `#DC2626` | Errors, destructive actions |
| `--border` | `black / 8%` | Subtle borders — do not overuse |
| `--muted-foreground` | `#6B7280` | Muted text |

A `.dark` palette remains defined but the `dark` class is no longer set on
`<html>` — the site ships light-only.

Rule: **gold (`accent`) is decorative** — badges/stars/highlights. Interactive
hover states use `secondary` (#181818), never gold.

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
