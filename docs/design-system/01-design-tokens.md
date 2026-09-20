# Design System: Tokens & Foundations

This document specifies the foundational design tokens for the **ShopCart** e-commerce design system. All visual decisions across components and layouts derive directly from these tokens.

---

## 1. Color Palette

The ShopCart color system combines a energetic primary orange accent with rich deep charcoal/slate tones and clean, crisp neutrals.

### Brand & Accents
| Token | CSS Variable | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `--color-primary` | `#FF6B00` | Primary brand identifier, CTAs, highlight badges, timer accents |
| **Primary Hover** | `--color-primary-hover` | `#E05E00` | Hover/active states for primary actions |
| **Primary Light** | `--color-primary-light` | `#FFF3EB` | Soft badge backgrounds, highlight pill containers |
| **Primary Subtle** | `--color-primary-subtle`| `#FFE8D9` | Accent borders and subtle card tinting |
| **Rating Gold** | `--color-rating` | `#FBBF24` | Star rating icons, reviews highlights |
| **Success** | `--color-success` | `#10B981` | In-stock badges, free shipping milestones, verified customer tags |
| **Danger / Sale** | `--color-danger` | `#EF4444` | Discount badges, stock alert markers |

### Dark Surfaces & Textures
| Token | CSS Variable | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Dark Pure** | `--color-dark-900` | `#0B0F17` | Flash sale container, mega footer base |
| **Dark Primary**| `--color-dark-800` | `#111827` | Primary dark buttons, dark badges, high-contrast headings |
| **Dark Surface**| `--color-dark-700` | `#1F2937` | Timer countdown block backgrounds, footer card headers |
| **Dark Border** | `--color-dark-border`| `#374151` | Subtle divider lines in dark sections |

### Neutrals & Surfaces
| Token | CSS Variable | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Surface White** | `--color-surface` | `#FFFFFF` | Default card background, input fields, dropdown popovers |
| **Surface Muted** | `--color-surface-muted`| `#F9FAFB` | Category card backdrop, table rows, hero background gradient |
| **Surface Accent**| `--color-surface-subtle`| `#F3F4F6` | Category icon circles, disabled button states |
| **Border Light** | `--color-border-light` | `#F3F4F6` | Light card borders, subtle separators |
| **Border Standard** | `--color-border` | `#E5E7EB` | Standard form borders, card outlines |
| **Border Dark** | `--color-border-hover` | `#D1D5DB` | Input focus-visible borders, active pill borders |

### Text Hierarchy
| Token | CSS Variable | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Text Primary** | `--color-text-primary` | `#111827` | Main headings, product titles, bold prices |
| **Text Secondary**| `--color-text-secondary`| `#4B5563` | Subheadings, descriptions, body text |
| **Text Muted** | `--color-text-muted` | `#9CA3AF` | Strikethrough compare-at prices, meta timestamps, placeholders |
| **Text Inverted** | `--color-text-white` | `#FFFFFF` | White text on dark buttons and banners |

---

## 2. Typography Scale

The type system is built on **Plus Jakarta Sans** (with fallback to `Inter, -apple-system, sans-serif`). It conveys modernity, legibility, and high-energy commerce confidence.

```css
--font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale
| Role | Size | Line Height | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `44px` / `2.75rem` | `1.15` | `800` (ExtraBold) | `-0.025em` |
| **H1 Headline** | `32px` / `2.0rem` | `1.2` | `700` (Bold) | `-0.02em` |
| **H2 Section** | `24px` / `1.5rem` | `1.3` | `700` (Bold) | `-0.015em` |
| **H3 Card** | `18px` / `1.125rem`| `1.35` | `600` (SemiBold) | `-0.01em` |
| **H4 Subheading**| `16px` / `1.0rem` | `1.4` | `600` (SemiBold) | `normal` |
| **Body Standard**| `15px` / `0.9375rem`| `1.5` | `400` (Regular) | `normal` |
| **Body Medium** | `15px` / `0.9375rem`| `1.5` | `500` (Medium) | `normal` |
| **Caption / Meta**| `13px` / `0.8125rem`| `1.45` | `500` (Medium) | `0.01em` |
| **Micro / Badge**| `11px` / `0.6875rem`| `1.2` | `700` (Bold) | `0.05em` (Caps) |

---

## 3. Spacing Rhythm

A modular 4px/8px baseline rhythm ensures visual balance across all screen sizes.

| Token | Value | Common Usage |
| :--- | :--- | :--- |
| `--space-1` | `4px` | Badge internal padding, icon-text gap |
| `--space-2` | `8px` | Button inline icon gap, small chip padding |
| `--space-3` | `12px` | Card internal items gap, list item vertical padding |
| `--space-4` | `16px` | Standard button padding, form input padding |
| `--space-5` | `20px` | Medium card inner padding, header horizontal padding |
| `--space-6` | `24px` | Standard section grid gap, card padding |
| `--space-8` | `32px` | Section element groupings, drawer padding |
| `--space-10` | `40px` | Sub-hero gap, promo banner padding |
| `--space-12` | `48px` | Section vertical rhythm on tablet/mobile |
| `--space-16` | `64px` | Major section vertical padding on desktop |
| `--space-20` | `80px` | Hero section padding, featured sections spacing |

---

## 4. Elevation & Shadows

Natural, multi-layered shadows create tactile depth without visual clutter.

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
--shadow-card-hover: 0 14px 28px -4px rgba(17, 24, 39, 0.12), 0 6px 10px -4px rgba(17, 24, 39, 0.06);
--shadow-primary-glow: 0 8px 20px -4px rgba(255, 107, 0, 0.35);
```

---

## 5. Border Radii

Softly rounded geometric corners deliver an approachable, polished consumer feel.

```css
--radius-xs: 4px;      /* Micro tags, small indicators */
--radius-sm: 8px;      /* Input fields, small buttons, tags */
--radius-md: 12px;     /* Category cards, blog cards, modals */
--radius-lg: 16px;     /* Product cards, promo banners, containers */
--radius-xl: 24px;     /* Hero container, testimonial cards */
--radius-full: 9999px; /* Pill buttons, search bars, circular avatars */
```

---

## 6. Motion & Micro-Interactions

```css
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
```
