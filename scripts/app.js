/**
 * ShopCart Enterprise Storefront Engine
 * Benchmarks: Bellroy, Neven Eyewear, FashionNova, Shein, Temu.
 * Includes: Multi-Tier Rewards Cart, Tabbed Filtering, Interactive Bundle Builder,
 * Feature Hotspots, Color Swatches, Quick View Modal, and Event Bus.
 */

// ==========================================================================
// 1. Core State & Pub/Sub Event Bus
// ==========================================================================
class StoreEngine {
  constructor() {
    this.events = {};
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.tier1 = 75.00;   // Free Shipping
    this.tier2 = 125.00;  // Free Express Delivery
    this.tier3 = 175.00;  // Free Mystery Gift ($35 Value)
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('shopcart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('shopcart_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }

  loadWishlist() {
    try {
      const saved = localStorage.getItem('shopcart_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem('shopcart_wishlist', JSON.stringify(Array.from(this.wishlist)));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }

  addToCart(product) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCart();
    this.emit('cart:updated', this.cart);
    this.emit('toast:show', { message: `Added "${product.title}" to cart!`, type: 'success' });
  }

  addBundle(items) {
    items.forEach(product => {
      const existing = this.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    });
    this.saveCart();
    this.emit('cart:updated', this.cart);
    this.emit('toast:show', { message: `🎉 "Buy 1 Get 2 Free™" Bundle Added! (Saved $89.98)`, type: 'success' });
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i.id !== productId);
    }
    this.saveCart();
    this.emit('cart:updated', this.cart);
  }

  removeItem(productId) {
    const item = this.cart.find(i => i.id === productId);
    const title = item ? item.title : 'Item';
    this.cart = this.cart.filter(i => i.id !== productId);
    this.saveCart();
    this.emit('cart:updated', this.cart);
    this.emit('toast:show', { message: `Removed "${title}" from cart.`, type: 'info' });
  }

  toggleWishlist(productId, title) {
    let status = false;
    if (this.wishlist.has(productId)) {
      this.wishlist.delete(productId);
      this.emit('toast:show', { message: `Removed "${title}" from wishlist.`, type: 'info' });
    } else {
      this.wishlist.add(productId);
      this.emit('toast:show', { message: `Added "${title}" to your wishlist!`, type: 'success' });
      status = true;
    }
    this.saveWishlist();
    this.emit('wishlist:updated', Array.from(this.wishlist));
    return status;
  }

  getTotalCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

// Global Store Instance
const store = new StoreEngine();

// ==========================================================================
// 2. Initialization on DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initToasts();
  initCartUI();
  initQuickViewModal();
  initProductCards();
  initCollectionTabs();
  initFlashDeals();
  initColorSwatches();
  initSearchFilter();
  initHeaderSearchShortcut();
  initPatternLibraryToggle();

  // Initial render of saved cart and wishlist
  store.emit('cart:updated', store.cart);
  store.emit('wishlist:updated', Array.from(store.wishlist));
});

// ==========================================================================
// 3. Toast Notification Engine
// ==========================================================================
function initToasts() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  store.on('toast:show', ({ message, type = 'info' }) => {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? 'var(--color-success)' : '#FFA066'}; font-weight: bold;">
        ${type === 'success' ? '✓' : 'ℹ'}
      </span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  });
}

// ==========================================================================
// 4. Multi-Tier Cart Drawer Engine (Temu & Shopify Plus Benchmark)
// ==========================================================================
function initCartUI() {
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

  // Cart State Change Listener
  store.on('cart:updated', (cartItems) => {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-count-badge');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const shippingBar = document.getElementById('free-shipping-progress');
    const shippingMsg = document.getElementById('free-shipping-msg');

    const tier1Label = document.getElementById('tier-1-label');
    const tier2Label = document.getElementById('tier-2-label');
    const tier3Label = document.getElementById('tier-3-label');

    const totalCount = store.getTotalCount();
    const subtotal = store.getSubtotal();

    if (badge) badge.textContent = totalCount;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Multi-Tier Milestone Progression Logic ($75, $125, $175)
    if (shippingBar && shippingMsg) {
      const percentage = Math.min((subtotal / store.tier3) * 100, 100);
      shippingBar.style.width = `${percentage}%`;

      if (subtotal >= store.tier3) {
        shippingBar.style.backgroundColor = 'var(--color-success)';
        shippingMsg.innerHTML = '🎉 <strong>VIP UNLOCKED!</strong> Free Express + Mystery Gift ($35 Value) Included!';
        if (tier1Label) tier1Label.classList.add('unlocked');
        if (tier2Label) tier2Label.classList.add('unlocked');
        if (tier3Label) tier3Label.classList.add('unlocked');
      } else if (subtotal >= store.tier2) {
        shippingBar.style.backgroundColor = 'var(--color-primary)';
        const needed = store.tier3 - subtotal;
        shippingMsg.innerHTML = `🚀 <strong>Express Unlocked!</strong> Add <strong>$${needed.toFixed(2)}</strong> for Free Mystery Gift`;
        if (tier1Label) tier1Label.classList.add('unlocked');
        if (tier2Label) tier2Label.classList.add('unlocked');
        if (tier3Label) tier3Label.classList.remove('unlocked');
      } else if (subtotal >= store.tier1) {
        shippingBar.style.backgroundColor = 'var(--color-primary)';
        const needed = store.tier2 - subtotal;
        shippingMsg.innerHTML = `📦 <strong>Free Shipping Unlocked!</strong> Add <strong>$${needed.toFixed(2)}</strong> for Free Express Delivery`;
        if (tier1Label) tier1Label.classList.add('unlocked');
        if (tier2Label) tier2Label.classList.remove('unlocked');
        if (tier3Label) tier3Label.classList.remove('unlocked');
      } else {
        shippingBar.style.backgroundColor = 'var(--color-primary)';
        const needed = store.tier1 - subtotal;
        shippingMsg.innerHTML = `Add <strong>$${needed.toFixed(2)}</strong> more for <strong>FREE Worldwide Shipping</strong>`;
        if (tier1Label) tier1Label.classList.remove('unlocked');
        if (tier2Label) tier2Label.classList.remove('unlocked');
        if (tier3Label) tier3Label.classList.remove('unlocked');
      }
    }

    if (!container) return;

    if (cartItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--color-text-muted);">
          <div style="font-size: 38px; margin-bottom: 12px;">🛍️</div>
          <p style="font-size: 1.05rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 6px;">Your cart is currently empty</p>
          <p style="font-size: 0.85rem; line-height: 1.4;">Explore our curated essentials and unlock tiered gifts & free delivery.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = cartItems.map(item => `
      <div style="display: flex; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
        <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid var(--color-border); background: #F8F9FA;" />
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-primary); line-height: 1.3;">${item.title}</h4>
          <div style="font-size: 0.9rem; font-weight: 800; color: var(--color-text-primary); margin-top: 2px;">$${item.price.toFixed(2)}</div>
          <div style="display: inline-flex; align-items: center; border: 1px solid var(--color-border); border-radius: 4px; margin-top: 6px; background: #fff;">
            <button onclick="store.updateQuantity('${item.id}', -1)" style="padding: 2px 8px; font-weight: bold; cursor: pointer;">-</button>
            <span style="padding: 0 8px; font-size: 0.85rem; font-weight: 600;">${item.quantity}</span>
            <button onclick="store.updateQuantity('${item.id}', 1)" style="padding: 2px 8px; font-weight: bold; cursor: pointer;">+</button>
          </div>
        </div>
        <button onclick="store.removeItem('${item.id}')" style="color: var(--color-text-muted); font-size: 20px; padding: 4px; cursor: pointer;" title="Remove">×</button>
      </div>
    `).join('');
  });
}

// ==========================================================================
// 5. Product Cards Actions & Wishlist Sync
// ==========================================================================
function initProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.getAttribute('data-product-id');
    const price = parseFloat(card.getAttribute('data-price'));
    const title = card.querySelector('.product-name').textContent;
    const image = card.querySelector('.product-media img').getAttribute('src');

    // Add to Cart
    const addBtn = card.querySelector('.btn-add-cart');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.addToCart({ id, title, price, image });
      });
    }

    // Wishlist Toggle
    const wishBtn = card.querySelector('.btn-wishlist');
    if (wishBtn) {
      if (store.wishlist.has(id)) wishBtn.classList.add('active');

      wishBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = store.toggleWishlist(id, title);
        wishBtn.classList.toggle('active', active);
      });
    }
  });

  store.on('wishlist:updated', (items) => {
    const badge = document.getElementById('wishlist-badge');
    if (badge) badge.textContent = items.length;
  });
}

// ==========================================================================
// 6. Tabbed Collection Switcher (FashionNova / Shein Benchmark)
// ==========================================================================
function initCollectionTabs() {
  const tabs = document.querySelectorAll('.tab-pill');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tab');

      cards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Global category shortcut for story scroller
window.filterCategory = function(catKey) {
  const targetTab = document.querySelector(`.tab-pill[data-tab="${catKey}"]`) || document.querySelector('.tab-pill[data-tab="all"]');
  if (targetTab) targetTab.click();
};

// ==========================================================================
// 7. Interactive Bundle Builder ("Buy 1 Get 2 Free™" Neven Eyewear)
// ==========================================================================
function initBundleBuilder() {
  const claimBtn = document.getElementById('claim-bundle-btn');
  if (!claimBtn) return;

  claimBtn.addEventListener('click', () => {
    const bundleItems = [
      { id: 'bundle-base', title: 'Smart Watch Pro (Base Item)', price: 89.00, image: 'assets/images/product_watch.jpg' },
      { id: 'bundle-free-1', title: 'Polarized Sunglasses (Free Reward 1)', price: 0.00, image: 'assets/images/product_sunglasses.jpg' },
      { id: 'bundle-free-2', title: 'Everyday Tech Organizer (Free Reward 2)', price: 0.00, image: 'assets/images/product_backpack.jpg' }
    ];

    store.addBundle(bundleItems);

    // Open Cart Drawer automatically
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

// ==========================================================================
// 8. Product Craftsmanship Hotspots (Bellroy Benchmark)
// ==========================================================================
const hotspotSpecs = {
  titanium: {
    title: "Aerospace-Grade Grade-5 Titanium",
    desc: "Precision CNC-machined frame delivering 40% weight reduction with 3x tensile strength versus stainless steel."
  },
  sapphire: {
    title: "Scratch-Proof Sapphire Crystal Lens",
    desc: "Mohs Hardness rating 9.0, second only to diamond, with dual anti-reflective inner optical coating."
  },
  biometrics: {
    title: "Medical-Grade Biometric Core",
    desc: "Continuous PPG optical sensor capturing real-time ECG, SpO2 blood oxygen, and HRV sleep biometrics."
  },
  battery: {
    title: "72-Hour Ultra-Endurance Dual-Cell Battery",
    desc: "Proprietary high-density lithium-silicon cell with 20-minute magnetic fast-charging to 80%."
  }
};

function initCraftHotspots() {
  const pins = document.querySelectorAll('.hotspot-pin');
  const card = document.getElementById('hotspot-card');
  const title = document.getElementById('hotspot-title');
  const desc = document.getElementById('hotspot-desc');

  if (!card || !title || !desc) return;

  pins.forEach(pin => {
    function activate() {
      const feat = pin.getAttribute('data-feature');
      if (hotspotSpecs[feat]) {
        title.textContent = hotspotSpecs[feat].title;
        desc.textContent = hotspotSpecs[feat].desc;
        card.style.transform = 'translateY(0)';
      }
    }

    pin.addEventListener('click', activate);
    pin.addEventListener('mouseenter', activate);
  });
}

// ==========================================================================
// 9. Interactive Color Swatches
// ==========================================================================
function initColorSwatches() {
  document.querySelectorAll('.swatch-picker').forEach(picker => {
    const dots = picker.querySelectorAll('.swatch-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        store.emit('toast:show', { message: `Selected variant: ${dot.getAttribute('title')}`, type: 'info' });
      });
    });
  });
}

// ==========================================================================
// 10. Quick View Product Modal
// ==========================================================================
function initQuickViewModal() {
  const modalBackdrop = document.getElementById('quick-view-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-product-img');
  const modalTitle = document.getElementById('modal-product-title');
  const modalPrice = document.getElementById('modal-product-price');
  const modalRating = document.getElementById('modal-product-rating');
  const modalAddToCartBtn = document.getElementById('modal-add-cart-btn');

  if (!modalBackdrop) return;

  let activeProduct = null;

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Clicking on product card media opens Quick View
  document.querySelectorAll('.product-card-media').forEach(media => {
    media.addEventListener('click', () => {
      const card = media.closest('.product-card');
      if (!card) return;

      const id = card.getAttribute('data-product-id');
      const title = card.querySelector('.product-name').textContent;
      const price = parseFloat(card.getAttribute('data-price'));
      const image = card.querySelector('.product-media img').getAttribute('src');

      activeProduct = { id, title, price, image };

      modalImg.src = image;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalPrice.textContent = `$${price.toFixed(2)}`;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (activeProduct) {
        store.addToCart(activeProduct);
        closeModal();
        document.getElementById('cart-drawer').classList.add('active');
        document.getElementById('cart-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

// ==========================================================================
// 11. Live Search Filter
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
// 12. Design System Pattern Library Toggle
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

// ==========================================================================
// 13. Clean Header & Search Shortcuts (⌘K)
// ==========================================================================
function initHeaderSearchShortcut() {
  const headerGlobal = document.getElementById('header-global');
  const searchInput = document.getElementById('header-search-input');

  if (!headerGlobal) return;

  // Clean up any stale compact state in localStorage to ensure default UI
  localStorage.removeItem('shopcart_header_density');
  headerGlobal.classList.remove('header-compact');

  // Quick keyboard shortcut (⌘K or Ctrl+K) to focus centered search bar
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

// ==========================================================================
// 14. Flash Deals Countdown & Cart Integration
// ==========================================================================
function initFlashDeals() {
  const hoursEl = document.getElementById('flash-hours');
  const minsEl = document.getElementById('flash-mins');
  const secsEl = document.getElementById('flash-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  // Initial countdown: 8 hours, 45 minutes, 32 seconds
  let totalSeconds = 8 * 3600 + 45 * 60 + 32;

  function updateTimer() {
    if (totalSeconds <= 0) {
      totalSeconds = 24 * 3600; // Reset
    }
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
    totalSeconds--;
  }

  updateTimer();
  setInterval(updateTimer, 1000);

  // Attach Add to Cart handlers to Flash Deal product cards
  document.querySelectorAll('.flash-card').forEach(card => {
    const btn = card.querySelector('.btn-add-cart');
    if (!btn) return;
    const id = btn.getAttribute('data-product-id');
    const price = parseFloat(btn.getAttribute('data-price'));
    const title = card.querySelector('.flash-card-title')?.textContent || 'Flash Item';
    const image = card.querySelector('.flash-card-media img')?.getAttribute('src') || '';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      store.addToCart({ id, title, price, image });
    });
  });
}


