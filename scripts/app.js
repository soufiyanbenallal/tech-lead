/**
 * ShopCart Interactive Storefront Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initCountdownTimer();
  initWishlist();
  initTestimonials();
  initNewsletter();
  initSearchFilter();
  initMobileMenu();
  initPatternLibraryToggle();
});

// ==========================================================================
// 1. Cart Drawer & Commerce State
// ==========================================================================
const cartState = {
  items: [],
  freeShippingThreshold: 99.00
};

function initCartDrawer() {
  const cartBtn = document.getElementById('header-cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close-btn');

  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Bind Add to Cart Buttons across the catalog
  document.querySelectorAll('.btn-add-cart, .btn-quick-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;

      const id = card.getAttribute('data-product-id');
      const title = card.querySelector('.product-name').textContent;
      const price = parseFloat(card.getAttribute('data-price'));
      const image = card.querySelector('.product-card-media img').getAttribute('src');

      addToCart({ id, title, price, image, quantity: 1 });
      openCart();
    });
  });
}

function addToCart(product) {
  const existingIndex = cartState.items.findIndex(item => item.id === product.id);
  if (existingIndex > -1) {
    cartState.items[existingIndex].quantity += 1;
  } else {
    cartState.items.push(product);
  }
  renderCart();
}

function updateQuantity(productId, delta) {
  const item = cartState.items.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cartState.items = cartState.items.filter(i => i.id !== productId);
  }
  renderCart();
}

function removeItem(productId) {
  cartState.items = cartState.items.filter(i => i.id !== productId);
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const badge = document.getElementById('cart-count-badge');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const shippingBar = document.getElementById('free-shipping-progress');
  const shippingMsg = document.getElementById('free-shipping-msg');

  const totalCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (badge) badge.textContent = totalCount;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Free shipping calculation
  if (shippingBar && shippingMsg) {
    const remaining = cartState.freeShippingThreshold - subtotal;
    if (subtotal >= cartState.freeShippingThreshold) {
      shippingBar.style.width = '100%';
      shippingBar.style.backgroundColor = 'var(--color-success)';
      shippingMsg.textContent = '🎉 Congratulations! You unlocked Free Shipping!';
    } else {
      const percentage = Math.min((subtotal / cartState.freeShippingThreshold) * 100, 100);
      shippingBar.style.width = `${percentage}%`;
      shippingBar.style.backgroundColor = 'var(--color-primary)';
      shippingMsg.textContent = `Add $${remaining.toFixed(2)} more for FREE Shipping`;
    }
  }

  if (!container) return;

  if (cartState.items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">Your shopping cart is empty</p>
        <p style="font-size: 0.85rem;">Discover great deals and add your favorite items!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cartState.items.map(item => `
    <div style="display: flex; gap: 12px; align-items: center; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
      <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; background: var(--color-surface-muted);" />
      <div style="flex-grow: 1;">
        <h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary);">${item.title}</h4>
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary); margin-top: 2px;">$${item.price.toFixed(2)}</div>
        <div style="display: inline-flex; align-items: center; border: 1px solid var(--color-border); border-radius: 4px; margin-top: 6px;">
          <button onclick="updateQuantity('${item.id}', -1)" style="padding: 2px 8px; font-weight: bold;">-</button>
          <span style="padding: 0 8px; font-size: 0.85rem;">${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', 1)" style="padding: 2px 8px; font-weight: bold;">+</button>
        </div>
      </div>
      <button onclick="removeItem('${item.id}')" style="color: var(--color-text-muted); font-size: 18px; padding: 4px;" title="Remove">×</button>
    </div>
  `).join('');
}

// Make globally accessible for onclick handlers
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// ==========================================================================
// 2. Real-Time Countdown Timer (Days, Hours, Mins, Secs)
// ==========================================================================
function initCountdownTimer() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Set target date: 2 days, 14 hours, 37 mins from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  targetDate.setHours(targetDate.getHours() + 14);
  targetDate.setMinutes(targetDate.getMinutes() + 37);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 3. Wishlist Interactivity
// ==========================================================================
function initWishlist() {
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = btn.classList.toggle('active');
      btn.setAttribute('aria-pressed', isActive);
      
      const icon = btn.querySelector('svg');
      if (isActive) {
        icon.style.transform = 'scale(1.25)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);
      }
    });
  });
}

// ==========================================================================
// 4. Testimonials Slider
// ==========================================================================
const testimonials = [
  {
    name: "Michael Brown",
    role: "Verified Buyer",
    quote: "Amazing quality and fast delivery! The products are exactly as described. Highly recommended!"
  },
  {
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    quote: "The Smart Watch Pro exceeded my expectations. Sleek design, accurate sensors, and unbeatable battery life."
  },
  {
    name: "David Chen",
    role: "Verified Buyer",
    quote: "Shopping at ShopCart has been seamless. Customer support responded within minutes when I asked about shipping."
  }
];

function initTestimonials() {
  const nameEl = document.getElementById('testimonial-name');
  const roleEl = document.getElementById('testimonial-role');
  const quoteEl = document.getElementById('testimonial-quote');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!nameEl || !quoteEl) return;

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const data = testimonials[index % testimonials.length];
      nameEl.textContent = data.name;
      roleEl.textContent = data.role;
      quoteEl.textContent = `“${data.quote}”`;
    });
  });
}

// ==========================================================================
// 5. Newsletter Validation
// ==========================================================================
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const checkbox = document.getElementById('newsletter-agree');
  const feedback = document.getElementById('newsletter-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkbox.checked) {
      feedback.textContent = '⚠️ Please accept the Privacy Policy to subscribe.';
      feedback.style.color = 'var(--color-danger)';
      feedback.style.display = 'block';
      return;
    }

    if (!input.value.includes('@') || !input.value.includes('.')) {
      feedback.textContent = '⚠️ Please enter a valid email address.';
      feedback.style.color = 'var(--color-danger)';
      feedback.style.display = 'block';
      return;
    }

    feedback.textContent = '✓ Thank you! You have successfully subscribed to exclusive deals.';
    feedback.style.color = 'var(--color-success)';
    feedback.style.display = 'block';
    input.value = '';
    checkbox.checked = false;
  });
}

// ==========================================================================
// 6. Live Search Filter
// ==========================================================================
function initSearchFilter() {
  const searchInput = document.getElementById('header-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const name = card.querySelector('.product-name').textContent.toLowerCase();
      if (!query || name.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// ==========================================================================
// 7. Mobile Navigation Drawer
// ==========================================================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu-drawer');
  const close = document.getElementById('mobile-menu-close');

  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.add('active'));
  }
  if (close && menu) {
    close.addEventListener('click', () => menu.classList.remove('active'));
  }
}

// ==========================================================================
// 8. Design System Pattern Library Toggle
// ==========================================================================
function initPatternLibraryToggle() {
  const toggleBtn = document.getElementById('ds-mode-toggle');
  const storeView = document.getElementById('storefront-view');
  const dsView = document.getElementById('pattern-library-view');

  if (!toggleBtn || !storeView || !dsView) return;

  toggleBtn.addEventListener('click', () => {
    const isDS = dsView.style.display !== 'none';
    if (isDS) {
      dsView.style.display = 'none';
      storeView.style.display = 'block';
      toggleBtn.innerHTML = '<span>🎨 View Design System</span>';
    } else {
      dsView.style.display = 'block';
      storeView.style.display = 'none';
      toggleBtn.innerHTML = '<span>🛍️ Back to Store</span>';
    }
  });
}
