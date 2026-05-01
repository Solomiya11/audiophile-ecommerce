// ==================== МОБІЛЬНЕ МЕНЮ ====================
const burger = document.querySelector(".burger");
const mobileMenu = document.getElementById("mobile-menu");
const cartDropdown = document.getElementById("cart-dropdown");
const overlay = document.getElementById("overlay");

let lastFocused = null;

function openMenu() {
  if (!burger || !mobileMenu) return;

  lastFocused = document.activeElement;
  mobileMenu.classList.add("open");
  document.body.classList.add("menu-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  burger.setAttribute("aria-expanded", "true");

  if (overlay) overlay.classList.add("hidden");

  const firstFocusable = mobileMenu.querySelector("a, button");
  if (firstFocusable) firstFocusable.focus();
}

function closeMenu() {
  if (!burger || !mobileMenu) return;

  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  burger.setAttribute("aria-expanded", "false");

  if (lastFocused) lastFocused.focus();
}
if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    if (cartDropdown) cartDropdown.classList.add("hidden");
    if (overlay) overlay.classList.add("hidden");

    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open"))
      closeMenu();
  });
}

// ==================== ХОВАННЯ HEADER ====================
const headerEl = document.querySelector("header");
let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
  if (document.body.classList.contains("menu-open")) return;
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 100) {
    headerEl.classList.add("hide");
  } else {
    headerEl.classList.remove("hide");
  }
  lastScroll = currentScroll;
});

const goBackBtn = document.getElementById("goBack");
if (goBackBtn) {
  goBackBtn.addEventListener("click", function (e) {
    e.preventDefault();
    history.back();
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

// ==================== КОШИК ====================
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.querySelector(".cart-icon");
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmptyEl = document.getElementById("cart-empty");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountEl = document.getElementById("cart-count");
  const cartItemCountEl = document.getElementById("cart-item-count");
  const removeAllBtn = document.getElementById("remove-all");
  const checkoutLink = document.getElementById("checkout");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
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
      cartEmptyEl?.classList.remove("hidden");
      cartItemsContainer?.classList.add("hidden");
      cartTotalEl?.classList.add("hiddenцц");
      checkoutLink && (checkoutLink.style.display = "none");
      removeAllBtn && (removeAllBtn.style.display = "none");
    } else {
      cartEmptyEl?.classList.add("hidden");
      cartItemsContainer?.classList.remove("hidden");
      cartTotalEl?.classList.remove("hidden");
      checkoutLink && (checkoutLink.style.display = "block");
      removeAllBtn && (removeAllBtn.style.display = "block");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Додавання товару
  document.querySelectorAll(".btn.add-to-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;

      // Беремо кількість з інпута
      const container =
        btn.closest(".add-to-cart-wrapper") || btn.closest(".add-to-cart");
      const qtyInput = container
        ? container.querySelector('input[type="number"]')
        : null;
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value)) || 1 : 1;

      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ name, price, quantity: qty, image });
      }

      updateCart();

      const notification = document.createElement("div");
      notification.textContent = "✅ Added to cart!";
      notification.style.cssText =
        "position:fixed; bottom:20px; right:20px; background:#d87d4a; color:white; padding:15px 25px; border-radius:8px; font-weight:bold; z-index:9999; font-size:16px;";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    });
  });

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector('input[type="number"]');
      if (!input) return;

      let value = parseInt(input.value) || 1;

      if (btn.dataset.action === "minus") {
        value = Math.max(1, value - 1);
      } else if (btn.dataset.action === "plus") {
        value++;
      }

      input.value = value;
    });
  });

  // Зміна кількості в кошику
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("cart-qty-btn")) {
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
        }
      }
    });
  }
  console.log("dropdown:", document.getElementById("cart-dropdown"));
  // Remove all
  if (removeAllBtn) {
    removeAllBtn.addEventListener("click", () => {
      cart = [];
      updateCart();
    });
  }

  // Відкриття/закриття кошика
  if (cartIcon && cartDropdown && overlay) {
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation();

      if (mobileMenu && mobileMenu.classList.contains("open")) {
        closeMenu();
      }

      const isHidden = cartDropdown.classList.toggle("hidden");
      overlay.classList.toggle("hidden", isHidden);
    });

    overlay.addEventListener("click", () => {
      cartDropdown.classList.add("hidden");
      overlay.classList.add("hidden");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      overlay &&
      cartDropdown &&
      cartIcon &&
      !cartDropdown.contains(e.target) &&
      !cartIcon.contains(e.target) &&
      !overlay.contains(e.target)
    ) {
      cartDropdown.classList.add("hidden");
      overlay.classList.add("hidden");
    }
  });

  // Ініціалізація
  updateCart();
});

////////////////// PAGE CHECKOUT ///////////////////

document.addEventListener("DOMContentLoaded", () => {
  if (
    !window.location.pathname.includes("checkout.html") &&
    !window.location.href.includes("checkout.html")
  )
    return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // === Елементи ===
  const form = document.getElementById("checkout-form");
  const continueBtn = document.getElementById("continue-pay");
  const successModal = document.getElementById("success-modal");
  const backHomeBtn = document.getElementById("back-to-home");

  // Payment toggle
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const eMoneyFields = document.getElementById("e-money-fields");
  const cashMessage = document.getElementById("cash-message");

  function updatePaymentUI() {
    const selectedValue = document.querySelector(
      'input[name="payment"]:checked',
    )?.value;
    const isEMoney = selectedValue === "e-money";

    eMoneyFields.classList.toggle("hidden", !isEMoney);
    cashMessage.classList.toggle("hidden", isEMoney);

    // required тільки коли e-money активний
    eMoneyFields.querySelectorAll("input").forEach((input) => {
      isEMoney
        ? input.setAttribute("required", "")
        : input.removeAttribute("required");
    });
  }

  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", updatePaymentUI);
  });
  updatePaymentUI(); // початковий стан

  // === SUMMARY ===
  const summaryItemsEl = document.getElementById("summary-items");
  const summaryTotalEl = document.getElementById("summary-total");
  const shippingEl = document.getElementById("summary-shipping");
  const vatEl = document.getElementById("vat");
  const grandTotalEl = document.getElementById("grand-total");

  function renderSummary() {
    if (!summaryItemsEl) return;
    summaryItemsEl.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const div = document.createElement("div");
      div.className = "summary-item";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="summary-item-info">
          <div class="summary-item-header">
            <p class="manrope-bold">${item.name}</p>
            <p class="sum manrope-bold">x${item.quantity}</p>
          </div>
          <p class="opacity-50 manrope-bold">$${item.price.toLocaleString()}</p>
        </div>
      `;
      summaryItemsEl.appendChild(div);
    });

    const vat = Math.round(subtotal * 0.2);
    const shipping = 50;
    const grandTotal = subtotal + shipping + vat;

    summaryTotalEl.textContent = `$${subtotal.toLocaleString()}`;
    shippingEl.textContent = `$${shipping}`;
    vatEl.textContent = `$${vat.toLocaleString()}`;
    grandTotalEl.textContent = `$${grandTotal.toLocaleString()}`;

    window.currentGrandTotal = grandTotal;
  }

  // === SUCCESS MODAL ===
  function showSuccessModal() {
    if (cart.length === 0) return;

    const firstItem = cart[0];
    const otherItems = cart.slice(1);
    const otherCount = otherItems.length;

    // Перший товар
    document.getElementById("modal-first-item").innerHTML = `
      <img src="${firstItem.image}" alt="${firstItem.name}">
      <div class="modal-info">
        <div class="modal-item-header">
        <p class="manrope-bold">${firstItem.name}</p>
        <p class="sum manrope-bold">×${firstItem.quantity}</p>
        </div>
        <p class="opacity-50 manrope-bold">$${firstItem.price.toLocaleString()}</p>
      </div>
    `;

    const otherEl = document.getElementById("modal-other-items");
    otherEl.innerHTML = "";

    if (otherCount > 0) {
      // Список прихований через style.display
      const extraItemsHTML = otherItems
        .map(
          (item) => `
        <div class="modal-extra-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="modal-info">
            <div class="modal-item-header">
              <p class="manrope-bold">${item.name}</p>
              <p class="sum manrope-bold">×${item.quantity}</p>
            </div>
            <p class="opacity-50 manrope-bold">$${item.price.toLocaleString()}</p>
          </div>
        </div>
      `,
        )
        .join("");

      otherEl.innerHTML = `
      <div id="other-list">
      ${extraItemsHTML}
      </div>
      <div class="modal-divider"></div>
        <button id="other-toggle" class="other-count ">and ${otherCount} other item(s)</button>
      `;

      let expanded = false;
      const toggleBtn = document.getElementById("other-toggle");
      const list = document.getElementById("other-list");

      toggleBtn.addEventListener("click", () => {
        expanded = !expanded;
        list.style.display = expanded ? "flex" : "none";
        toggleBtn.textContent = expanded
          ? "View less"
          : `and ${otherCount} other item(s)`;
      });
    }

    // Grand Total
    document.getElementById("modal-grand-total").textContent =
      `$${window.currentGrandTotal.toLocaleString()}`;

    successModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  // === CONTINUE & PAY ===
  continueBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (form.checkValidity()) {
      showSuccessModal();
      localStorage.removeItem("cart"); // очищаємо кошик після замовлення
    } else {
      form.reportValidity();
    }
  });

  // === BACK TO HOME ===
  backHomeBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    document.body.style.overflow = "auto";
    window.location.href = "index.html";
  });

  // Закриття модалки по фону та Esc
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      successModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !successModal.classList.contains("hidden")) {
      successModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  // Ініціалізація
  renderSummary();
});

/// ==================== ВАЛІДАЦІЯ ПОЛІВ ====================
const allInputs = document.querySelectorAll("#checkout-form input");

allInputs.forEach((input) => {
  input.addEventListener("blur", () => {
    const wrapper = input.closest(".field-wrapper");
    if (!wrapper) return;

    // Показуємо помилку ТІЛЬКИ якщо щось введено, але невалідно
    if (input.value.trim() !== "" && !input.checkValidity()) {
      wrapper.classList.add("invalid");
    } else {
      wrapper.classList.remove("invalid");
    }
  });

  // Знімаємо помилку як тільки починають виправляти
  input.addEventListener("input", () => {
    const wrapper = input.closest(".field-wrapper");
    if (!wrapper) return;
    if (input.checkValidity()) {
      wrapper.classList.remove("invalid");
    }
  });
});

// ==================== ZOOM на головному фото ====================
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("product-")) {
    // Забираємо курсор збільшення на сторінках груп товарів
    document.querySelectorAll(".product-img").forEach((wrapper) => {
      wrapper.style.cursor = "default";
    });
    return;
  }

  const allWrappers = document.querySelectorAll(".product-img");
  allWrappers.forEach((productImgWrapper) => {
    const productImg = productImgWrapper.querySelector("img");
    if (!productImg) return;

    const zoomLens = document.createElement("div");
    zoomLens.classList.add("zoom-lens");
    productImgWrapper.appendChild(zoomLens);

    const zoomResult = document.createElement("div");
    zoomResult.classList.add("zoom-result");
    productImgWrapper.appendChild(zoomResult);

    const ZOOM = 1.5;
    let zoomActive = false;

    function updateZoom(e) {
      const rect = productImg.getBoundingClientRect();
      const lensW = zoomLens.offsetWidth;
      const lensH = zoomLens.offsetHeight;

      let x = e.clientX - rect.left - lensW / 2;
      let y = e.clientY - rect.top - lensH / 2;

      x = Math.max(0, Math.min(x, rect.width - lensW));
      y = Math.max(0, Math.min(y, rect.height - lensH));

      zoomLens.style.left = x + "px";
      zoomLens.style.top = y + "px";

      const bgX = (x / (rect.width - lensW)) * 100;
      const bgY = (y / (rect.height - lensH)) * 100;

      zoomResult.style.backgroundImage = `url(${productImg.currentSrc})`;
      zoomResult.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
      zoomResult.style.backgroundPosition = `${bgX}% ${bgY}%`;
    }

    document.addEventListener("mousemove", (e) => {
      if (window.innerWidth <= 1024) return;

      const rect = productImgWrapper.getBoundingClientRect();
      const isOverImage =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isOverImage) {
        if (!zoomActive) {
          zoomLens.style.display = "block";
          zoomResult.style.display = "block";
          zoomActive = true;
        }
        updateZoom(e);
      } else {
        if (zoomActive) {
          zoomLens.style.display = "none";
          zoomResult.style.display = "none";
          zoomActive = false;
        }
      }
    });

    // Мобільний клік
    productImg.addEventListener("click", () => {
      if (window.innerWidth > 1024) return;
      productImg.classList.toggle("zoomed");
    });
  });
});
// === DEMO CHECKOUT FUNCTION ===
document.addEventListener("DOMContentLoaded", () => {
  const demoBtn = document.getElementById("demo-checkout-btn");

  if (demoBtn) {
    demoBtn.addEventListener("click", loadDemoCartAndGoToCheckout);
  }
});

function loadDemoCartAndGoToCheckout() {
  // Приклад товарів (змінюй id і кількість за потребою)
  const demoItems = [
    {
      id: 1,
      name: "XX99 MK II",
      price: 2999,
      quantity: 2,
      image:
        "./assets/product-xx99-mark-two-headphones/desktop/image-product.jpg", // зміни шлях якщо треба
    },
    {
      id: 2,
      name: "ZX9",
      price: 4500,
      quantity: 1,
      image: "./assets/product-zx9-speaker/desktop/image-product.jpg",
    },
  ];

  localStorage.setItem("cart", JSON.stringify(demoItems));

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }

  // Переходимо на checkout
  window.location.href = "checkout.html";
}

const allProducts = [
  {
    name: "XX99 Mark II",
    slug: "product-xx99-mark-two-headphones",
    mobile: "./assets/shared/mobile/image-xx99-mark-two-headphones.jpg",
    tablet: "./assets/shared/tablet/image-xx99-mark-two-headphones.jpg",
    desktop: "./assets/shared/desktop/image-xx99-mark-two-headphones.jpg",
    alt: "Headphone XX99 Mark Two"
  },
  {
    name: "XX99 Mark I",
    slug: "product-xx99-mark-one-headphones",
    mobile: "./assets/shared/mobile/image-xx99-mark-one-headphones.jpg",
    tablet: "./assets/shared/tablet/image-xx99-mark-one-headphones.jpg",
    desktop: "./assets/shared/desktop/image-xx99-mark-one-headphones.jpg",
    alt: "Headphone XX99 Mark One"
  },
  {
    name: "XX59",
    slug: "product-xx59-headphones",
    mobile: "./assets/shared/mobile/image-xx59-headphones.jpg",
    tablet: "./assets/shared/tablet/image-xx59-headphones.jpg",
    desktop: "./assets/shared/desktop/image-xx59-headphones.jpg",
    alt: "Headphone XX59"
  },
  {
    name: "ZX9 Speaker",
    slug: "product-zx9-speaker",
    mobile: "./assets/shared/mobile/image-zx9-speaker.jpg",
    tablet: "./assets/shared/tablet/image-zx9-speaker.jpg",
    desktop: "./assets/shared/desktop/image-zx9-speaker.jpg",
    alt: "Speaker ZX9"
  },
  {
    name: "ZX7 Speaker",
    slug: "product-zx7-speaker",
    mobile: "./assets/shared/mobile/image-zx7-speaker.jpg",
    tablet: "./assets/shared/tablet/image-zx7-speaker.jpg",
    desktop: "./assets/shared/desktop/image-zx7-speaker.jpg",
    alt: "Speaker ZX7"
  },
];

function renderAlsoLike() {
  const container = document.getElementById("also-like");
  if (!container) return; // не продуктова сторінка — виходимо

  // Визначаємо поточний slug з URL
  const currentSlug = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  // Фільтруємо поточний товар і перемішуємо
  const others = allProducts.filter(p => p.slug !== currentSlug);
  const picked = others.sort(() => Math.random() - 0.5).slice(0, 3);

  container.innerHTML = picked.map(p => `
    <div class="categ">
      <picture>
        <source media="(max-width: 576px)" srcset="${p.mobile}" />
        <source media="(max-width: 1024px)" srcset="${p.tablet}" />
        <img src="${p.desktop}" alt="${p.alt}" class="categories_2_img" />
      </picture>
      <h2>${p.name}</h2>
      <a href="./${p.slug}.html" class="btn">See product</a>
    </div>
  `).join("");
}

renderAlsoLike();
