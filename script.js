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

    // повернути фокус назад на бургер
    if (lastFocused) lastFocused.focus();
  }

  burger.addEventListener('click', () => {
    const opened = mobileMenu.classList.contains('open');
    if (opened) closeMenu();
    else openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
  
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMenu();
  });
}
const header = document.querySelector('header');

let lastScroll = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  // якщо меню відкрите — не ховаємо хедер
  if (document.body.classList.contains('menu-open')) return;

  if (currentScroll > lastScroll && currentScroll > 100) {
    // скрол вниз
    header.classList.add('hide');
  } else {
    // скрол вгору
    header.classList.remove('hide');
  }

  lastScroll = currentScroll;
});

const quantityInput = document.querySelector('.quantity input');
const qtyButtons = document.querySelectorAll('.qty-btn');
const addToCartBtn = document.getElementById('addToCart');

qtyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);

    if (btn.dataset.action === 'plus') {
      quantityInput.value = value + 1;
    }

    if (btn.dataset.action === 'minus' && value > 1) {
      quantityInput.value = value - 1;
    }
  });
});

addToCartBtn.addEventListener('click', (e) => {
  e.preventDefault(); // щоб <a> не скакала

  const quantity = parseInt(quantityInput.value);

  console.log('Add to cart:', quantity);
  // тут далі:
  // addToCart(productId, quantity)
});


