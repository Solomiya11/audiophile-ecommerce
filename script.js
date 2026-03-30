// ==================== МОБІЛЬНЕ МЕНЮ (твій старий код) ====================
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

    const firstFocusable = mobileMenu.querySelector('button, a[href], input, [tabindex]:not([tabindex="-1"])');
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
    const opened = mobileMenu.classList.contains('open');
    if (opened) closeMenu();
    else openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
}

// ==================== ХОВАННЯ HEADER НА СКРОЛ ====================
const headerEl = document.querySelector('header');
let lastScroll = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (document.body.classList.contains('menu-open')) return;

  if (currentScroll > lastScroll && currentScroll > 100) {
    headerEl.classList.add('hide');
  } else {
    headerEl.classList.remove('hide');
  }
  lastScroll = currentScroll;
});

// ==================== QUANTITY НА ПРОДУКТІ (твій старий код) ====================
const quantityInput = document.querySelector('.quantity input');
const qtyButtons = document.querySelectorAll('.qty-btn');

if (qtyButtons.length > 0) {
  qtyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      let value = parseInt(quantityInput.value);
      if (btn.dataset.action === 'plus') quantityInput.value = value + 1;
      if (btn.dataset.action === 'minus' && value > 1) quantityInput.value = value - 1;
    });
  });
}

// ==================== КОШИК (виправлений і повний) ====================
document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.querySelector('.cart-icon');           // ← тепер шукаємо .cart-icon
  const cartDropdown = document.getElementById('cart-dropdown');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const cartItemCount = document.getElementById('cart-item-count');
  const removeAll = document.getElementById('remove-all');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  

  function updateCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        <img src="./assets/cart/image-${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg" 
             alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <p class="cart-item-name manrope-bold">${item.name}</p>
          <p class="cart-item-price">$ ${item.price.toLocaleString()}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="changeQuantity(${index}, -1)">–</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
      
      total += item.price * item.quantity;
      itemCount += item.quantity;
    });

    if (cartTotal) cartTotal.textContent = `$ ${total.toLocaleString()}`;
    if (cartCount) cartCount.textContent = itemCount;
    if (cartItemCount) cartItemCount.textContent = itemCount;

    const isEmpty =cart.length ===0;

    const cartEmptyMessage = document.getElementById('cart-empty');
    const cartTotalBlock = document.querySelector('.cart-total');
    const checkoutBtn = document.getElementById('checkout');


    // Показуємо/ховаємо порожній кошик
    if (cart.length === 0) {
      if (cartEmptyMessage) cartEmptyMessage.classList.remove('hidden');
      if (cartTotalBlock) cartTotalBlock.style.display = 'none';
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      if (removeAll) removeAll.style.display = 'none';
    } else {
      if (document.getElementById('cart-empty')) document.getElementById('cart-empty').style.display = 'none';
      if (cartTotalBlock) cartTotalBlock.style.display = 'flex';
      if (checkoutBtn) checkoutBtn.style.display = 'block';
      if (removeAll) removeAll.style.display = 'block';
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Додавання товару
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const qty = quantityInput ? parseInt(quantityInput.value) : 1;

      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ name, price, quantity: qty });
      }

      updateCart();
      if (cartDropdown) cartDropdown.classList.remove('hidden'); // відкриваємо кошик одразу
    });
  });

  window.changeQuantity = (index, change) => {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
  };

  if (removeAll) {
    removeAll.addEventListener('click', () => {
      cart = [];
      updateCart();
    });
  }

  // Клік на іконку кошика
  if (cartIcon && cartDropdown) {
    cartIcon.addEventListener('click', () => {
      cartDropdown.classList.toggle('hidden');
    });
  }

  updateCart(); // ініціалізація при завантаженні
});

