// ==================== МОБІЛЬНЕ МЕНЮ ====================
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobile-menu');

let lastFocused = null;

if (burger && mobileMenu) {
  function openMenu() {
    lastFocused = document.activeElement;
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    const firstFocusable = mobileMenu.querySelector('a, button');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    if (lastFocused) lastFocused.focus();
  }

  burger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
}

// ==================== ХОВАННЯ HEADER ====================
const headerEl = document.querySelector('header');
let lastScroll = window.scrollY;

window.addEventListener('scroll', () => {
  if (document.body.classList.contains('menu-open')) return;
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    headerEl.classList.add('hide');
  } else {
    headerEl.classList.remove('hide');
  }
  lastScroll = currentScroll;
});

// ==================== КОШИК ====================
document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.querySelector('.cart-icon');
  const cartDropdown = document.getElementById('cart-dropdown');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartEmptyEl = document.getElementById('cart-empty');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');
  const cartItemCountEl = document.getElementById('cart-item-count');
  const removeAllBtn = document.getElementById('remove-all');
  const checkoutLink = document.getElementById('checkout');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <p class="cart-item-name manrope-bold">${item.name}</p>
          <p class="cart-item-price">$${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="cart-qty-btn" data-index="${index}" data-change="-1">–</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-btn" data-index="${index}" data-change="1">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);

      total += item.price * item.quantity;
      itemCount += item.quantity;
    });

    // Оновлюємо цифри
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toLocaleString()}`;
    if (cartCountEl) cartCountEl.textContent = itemCount;
    if (cartItemCountEl) cartItemCountEl.textContent = itemCount;

    // Логіка порожнього кошика
    const isEmpty = cart.length === 0;

    if (isEmpty) {
      cartEmptyEl?.classList.remove('hidden');
      cartItemsContainer?.classList.add('hidden');
      cartTotalEl?.classList.add('hidden');
      checkoutLink && (checkoutLink.style.display = 'none');
      removeAllBtn && (removeAllBtn.style.display = 'none');
    } else {
      cartEmptyEl?.classList.add('hidden');
      cartItemsContainer?.classList.remove('hidden');
      cartTotalEl?.classList.remove('hidden');
      checkoutLink && (checkoutLink.style.display = 'block');
      removeAllBtn && (removeAllBtn.style.display = 'block');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Додавання товару
  document.querySelectorAll('.btn.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;

      // Беремо кількість з інпута
      const container = btn.closest('.add-to-cart-wrapper') || btn.closest('.add-to-cart');
      const qtyInput = container ? container.querySelector('input[type="number"]') : null;
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value)) || 1 : 1;

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ name, price, quantity: qty, image });
      }

      updateCart();

      const notification = document.createElement('div');
      notification.textContent = '✅ Додано в кошик!';
      notification.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#d87d4a; color:white; padding:15px 25px; border-radius:8px; font-weight:bold; z-index:9999;';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    });
  });

  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input[type="number"]');
      if (!input) return;

      let value = parseInt(input.value) || 1;

      if (btn.dataset.action === 'minus') {
        value = Math.max(1, value - 1);
      } else if (btn.dataset.action === 'plus') {
        value++;
      }

      input.value = value;
    });
  });

  // Зміна кількості в кошику
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('cart-qty-btn')) {
        e.stopPropagation();
        e.stopImmediatePropagation();

        const index = parseInt(e.target.dataset.index);
        const change = parseInt(e.target.dataset.change);

        if (isNaN(index) || cart[index]) {
          cart[index].quantity += change;
          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }
          updateCart();
        };
      }
    });
  }

  // Remove all
  if (removeAllBtn) {
    removeAllBtn.addEventListener('click', () => {
      cart = [];
      updateCart();
    });
  }

  // Відкриття/закриття кошика
  if (cartIcon && cartDropdown) {
    cartIcon.addEventListener('click', () => {
      cartDropdown.classList.toggle('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (cartDropdown && !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
      cartDropdown.classList.add('hidden');
    }
  });

  // Ініціалізація
  updateCart();
});
