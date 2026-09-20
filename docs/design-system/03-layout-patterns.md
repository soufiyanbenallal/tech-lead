# Design System: Layout Patterns & Responsive Rules

This document specifies the responsive grid systems, container rules, and section rhythm for the **ShopCart** UI design system.

---

## 1. Breakpoints

The responsive system is mobile-first, targeting modern viewport distributions:

| Viewport Name | Min Width | Target Devices |
| :--- | :--- | :--- |
| **Mobile (`xs`)** | `0px` | Smart phones (iPhone, Pixel) |
| **Mobile Large (`sm`)** | `640px` | Large phones in landscape |
| **Tablet (`md`)** | `768px` | iPads, small tablets |
| **Desktop (`lg`)** | `1024px` | Laptops, medium monitors |
| **Desktop Wide (`xl`)** | `1280px` | Standard desktop displays |
| **Max Container (`2xl`)** | `1440px` | Maximum container width constraint |

---

## 2. Container Hierarchy

```css
.container {
  width: 100%;
  max-width: var(--container-max, 1280px);
  margin-inline: auto;
  padding-inline: var(--space-4, 16px);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-6, 24px);
  }
}

@media (min-width: 1280px) {
  .container {
    padding-inline: var(--space-8, 32px);
  }
}
```

---

## 3. Section Rhythm & Spacing

To establish visual hierarchy without clutter, sections follow standardized vertical spacing:

```css
.section {
  padding-block: var(--space-12, 48px);
}

@media (min-width: 1024px) {
  .section {
    padding-block: var(--space-16, 64px);
  }
}
```

### Section Header Pattern
All catalog and content sections share a consistent header layout:
```html
<div class="section-header">
  <h2 class="section-title">Shop By Category</h2>
  <a href="#view-all" class="section-link">
    <span>View All Categories</span>
    <svg class="icon-arrow" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
    </svg>
  </a>
</div>
```

---

## 4. Grid Architecture

### 4.1 Category Grid (6 Items)
- **Mobile**: 2 columns (`repeat(2, 1fr)`)
- **Tablet**: 3 columns (`repeat(3, 1fr)`)
- **Desktop**: 6 columns (`repeat(6, 1fr)`)

### 4.2 Product Grid (6 Items)
- **Mobile**: 1 to 2 columns (`repeat(auto-fit, minmax(160px, 1fr))`)
- **Tablet**: 3 columns (`repeat(3, 1fr)`)
- **Desktop**: 6 columns (`repeat(6, 1fr)`) or 2 rows of 3 columns

### 4.3 Split Sections (2 Equal Columns)
- **Testimonial & Why Shop With Us**: 1 column on mobile, 2 columns on desktop (`grid-template-columns: 1fr 1fr; gap: var(--space-8);`)
- **Newsletter & Instagram**: 1 column on mobile, 2 columns on desktop
- **Blog & FAQ**: 1 column on mobile, 2 columns on desktop

### 4.4 Value Proposition Strip (4 Items)
- **Mobile**: 2 columns
- **Desktop**: 4 equal columns with icon and stacked title/subtitle

### 4.5 Mega Footer
- **Mobile**: 1 to 2 columns accordion/stack
- **Desktop**: 5 columns (Brand Story 2fr, Quick Links 1fr, Customer Service 1fr, My Account 1fr, Contact Info 1.5fr)
