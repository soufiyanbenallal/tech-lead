# Design System: Component Patterns & Specifications

This document outlines the architecture, markup conventions, state variants, and accessibility requirements for all components in the **ShopCart** UI design system.

---

## 1. Atoms

### 1.1 Buttons (`.btn`)
Buttons represent triggerable user actions with distinct visual hierarchy.

#### Variants:
- `.btn-primary`: Solid brand orange (`#FF6B00`) background, white text. Primary call-to-actions (e.g. "Shop The Sale").
- `.btn-dark`: Solid charcoal/dark slate (`#111827`) background, white text. Core catalog actions (e.g. "Add to Cart", "Shop Now", "Subscribe", "Follow Us").
- `.btn-outline`: Transparent background with border (`#E5E7EB` or dark). Secondary actions (e.g. "Explore Collection").
- `.btn-icon`: Circular icon button with subtle border/hover background. Wishlist heart and quick cart triggers.
- `.btn-pill`: Fully rounded (`--radius-full`) button with compact padding.

```html
<!-- Primary Button -->
<button class="btn btn-primary">
  <span>Shop The Sale</span>
</button>

<!-- Dark Button (Add to Cart) -->
<button class="btn btn-dark btn-full">
  <svg class="icon" aria-hidden="true">...</svg>
  <span>Add to Cart</span>
</button>

<!-- Icon Button (Wishlist) -->
<button class="btn-icon" aria-label="Add Smart Watch Pro to wishlist" aria-pressed="false">
  <svg class="icon-heart" viewBox="0 0 24 24">...</svg>
</button>
```

### 1.2 Badges & Chips (`.badge`)
Informative status indicators and promotional callouts.

- `.badge-accent`: Light orange background (`--color-primary-light`), orange text (`--color-primary`), bold uppercase (e.g. `NEW COLLECTION`).
- `.badge-discount`: Dark circular overlay badge (`Save 30%`).
- `.badge-verified`: Subtle green background with checkmark icon (`Verified Buyer`).
- `.badge-counter`: Small circular notification badge with count number on cart icon.

```html
<span class="badge badge-accent">NEW COLLECTION</span>
<div class="badge-discount">
  <span class="badge-discount-label">Save</span>
  <span class="badge-discount-val">30%</span>
</div>
```

### 1.3 Form Inputs (`.form-input`, `.form-checkbox`)
- `.input-search`: Pill-shaped search bar with inline search icon, subtle border, smooth focus ring with `--color-primary`.
- `.input-text`: Standard rounded input with placeholder, hover state, and validation states (`:user-valid`, `:user-invalid`).
- `.checkbox-custom`: Accessible hidden checkbox with custom visual checkbox square and SVG checkmark.

---

## 2. Molecules

### 2.1 Category Card (`.category-card`)
Minimalist card with light background container, centered category image, and title.

```html
<a href="#category-electronics" class="category-card">
  <div class="category-card-media">
    <img src="assets/images/category-electronics.webp" alt="Electronics" loading="lazy" />
  </div>
  <span class="category-card-title">Electronics</span>
</a>
```

### 2.2 Product Card (`.product-card`)
The central commerce conversion unit.
- **Top Bar**: Absolute floating action buttons:
  - Quick Wishlist toggle (`.btn-wishlist`) with heart animation.
  - Quick Cart preview (`.btn-quick-cart`).
- **Media**: Centered product imagery with hover zoom (`transform: scale(1.04)`).
- **Meta Information**:
  - Title (`.product-title`): Two-line clamping with hover underline/color change.
  - Rating (`.product-rating`): 5-star graphic with gold fill + review count in parentheses `(128)`.
  - Pricing (`.product-price-row`): Active price in bold dark text + strikethrough original price in muted text.
- **Footer**: Full-width dark button ("Add to Cart") with active feedback.

```html
<article class="product-card" data-product-id="1" data-price="129.99">
  <div class="product-card-header">
    <button class="btn-icon btn-wishlist" aria-label="Add to wishlist" aria-pressed="false">
      <svg class="icon-heart">...</svg>
    </button>
    <button class="btn-icon btn-quick-cart" aria-label="Quick add to cart">
      <svg class="icon-cart-quick">...</svg>
    </button>
  </div>
  <div class="product-card-media">
    <img src="assets/images/product-watch.webp" alt="Smart Watch Pro" loading="lazy" />
  </div>
  <div class="product-card-content">
    <h3 class="product-title">Smart Watch Pro</h3>
    <div class="product-rating" aria-label="Rating 4.8 out of 5 stars">
      <div class="rating-stars" style="--rating: 4.8">★★★★★</div>
      <span class="rating-count">(128)</span>
    </div>
    <div class="product-price-row">
      <span class="price-current">$129.99</span>
      <s class="price-compare">$199.99</s>
    </div>
    <button class="btn btn-dark btn-full btn-add-cart">
      Add to Cart
    </button>
  </div>
</article>
```

### 2.3 Countdown Unit (`.countdown-unit`)
Dark square block displaying numeric time unit with label beneath.

```html
<div class="countdown-unit">
  <span class="countdown-val" data-unit="days">02</span>
  <span class="countdown-label">Days</span>
</div>
```

### 2.4 FAQ Accordion Item (`.faq-item`)
Collapsible question-and-answer element with accessible keyboard controls.

```html
<details class="faq-item">
  <summary class="faq-summary">
    <span class="faq-question">What payment methods do you accept?</span>
    <span class="faq-icon" aria-hidden="true">+</span>
  </summary>
  <div class="faq-content">
    <p>We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay.</p>
  </div>
</details>
```

---

## 3. Organisms

### 3.1 Global Header & Navigation (`.header-global`)
1. **Utility Strip**: Top bar containing service perks and localization triggers.
2. **Main Navigation**: Fixed/sticky header containing:
   - Brand Logo with orange icon and dark lettering.
   - Primary links (Home, Shop, Categories, Deals, Pages, Blog, Contact) with dropdown chevron where applicable.
   - Search Bar with live autocomplete placeholder.
   - Account trigger & Cart button with animated item badge.

### 3.2 Hero Promotional Showcase (`.hero-section`)
Split 2-column showcase:
- Left: Promotional copy, "NEW COLLECTION" pill, dual CTAs ("Shop Now", "Explore Collection"), and 3 value trust badges.
- Right: 3D pedestal product showcase with Smart Watch Pro, floating dark circular "Save 30%" badge, and subtle ambient background glow.

### 3.3 Flash Sale Countdown Banner (`.banner-flash-sale`)
Dark high-contrast banner featuring:
- Orange accent tag ("Limited Time Offer").
- Highlighting headline ("Super Sale Up To **50% Off!**").
- Real-time countdown timer (Days, Hours, Mins, Secs) with automatic decrements.
- Vibrant orange "Shop The Sale" button.

### 3.4 Interactive Cart Drawer (`.cart-drawer`)
Accessible slide-over drawer:
- Dynamic list of added cart items with thumbnail, title, unit price, quantity steppers (`-`, count, `+`), and trash remove button.
- Live subtotal recalculation.
- Free shipping progress bar updating toward $99 goal.
- Primary checkout button.
