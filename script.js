const menuItems = [
  { id: "cappuccino", name: "Cappuccino", description: "Silky espresso, steamed milk, and a cloud of foam.", price: 650, image: "images/cappuccino.svg", tag: "Classic" },
  { id: "latte", name: "Latte", description: "A smooth, balanced pour for slow sips and soft starts.", price: 700, image: "images/latte.svg", tag: "Beloved" },
  { id: "mocha", name: "Mocha", description: "Rich cocoa folded into espresso, finished with velvety milk.", price: 780, image: "images/mocha.svg", tag: "Treat" },
  { id: "cold-brew", name: "Cold Brew", description: "Bright, slow-steeped coffee served cool and refreshing.", price: 750, image: "images/cold-brew.svg", tag: "Iced" }
];

const cart = new Map();
const currency = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", minimumFractionDigits: 2 });
const menuGrid = document.querySelector("#menu-grid");
const cartTrigger = document.querySelector("#cart-trigger");
const cartPanel = document.querySelector("#cart-panel");
const cartClose = document.querySelector("#cart-close");
const overlay = document.querySelector("#overlay");
const cartBody = document.querySelector("#cart-body");
const cartSummary = document.querySelector("#cart-summary");
const checkoutView = document.querySelector("#checkout-view");
const checkoutButton = document.querySelector("#checkout-button");
const backToCart = document.querySelector("#back-to-cart");

function formatPrice(value) {
  return currency.format(value).replace("LKR", "Rs.");
}

function renderMenu() {
  menuGrid.innerHTML = menuItems.map((item) => `
    <article class="menu-card">
      <div class="menu-card-image">
        <img src="${item.image}" alt="${item.name} coffee">
        <span class="menu-tag">${item.tag}</span>
      </div>
      <div class="menu-card-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-price">${formatPrice(item.price)}</span>
          <button class="add-button" type="button" data-add-item="${item.id}">Add to order <span aria-hidden="true">+</span></button>
        </div>
      </div>
    </article>
  `).join("");
}

function getCartCount() {
  return [...cart.values()].reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return [...cart.values()].reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  const items = [...cart.values()];
  const count = getCartCount();
  const total = getCartTotal();
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#cart-subtotal").textContent = formatPrice(total);
  document.querySelector("#cart-total").textContent = formatPrice(total);
  document.querySelector("#checkout-total").textContent = formatPrice(total);

  if (!items.length) {
    cartBody.innerHTML = `<div class="cart-empty"><span aria-hidden="true">&#9749;</span><h3>Your cart is waiting</h3><p>Add a favorite from the menu and it will appear here.</p><a href="#menu" class="text-link" id="browse-menu">Browse menu <span aria-hidden="true">&#8594;</span></a></div>`;
    cartSummary.hidden = true;
    checkoutView.hidden = true;
    return;
  }

  cartBody.innerHTML = items.map((item) => `
    <div class="cart-item">
      <img class="cart-item-image" src="${item.image}" alt="">
      <div>
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)} each</p>
        <div class="quantity-controls" aria-label="Quantity controls for ${item.name}">
          <button type="button" data-decrease-item="${item.id}" aria-label="Decrease ${item.name} quantity">-</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase-item="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
        </div>
      </div>
      <strong class="cart-item-total">${formatPrice(item.price * item.quantity)}</strong>
    </div>
  `).join("");
  cartSummary.hidden = false;
}

function addToCart(itemId) {
  const item = menuItems.find((menuItem) => menuItem.id === itemId);
  if (!item) return;
  const existing = cart.get(itemId);
  cart.set(itemId, { ...item, quantity: existing ? existing.quantity + 1 : 1 });
  renderCart();
  openCart();
}

function changeQuantity(itemId, change) {
  const item = cart.get(itemId);
  if (!item) return;
  const nextQuantity = item.quantity + change;
  if (nextQuantity <= 0) cart.delete(itemId);
  else cart.set(itemId, { ...item, quantity: nextQuantity });
  renderCart();
}

function openCart() {
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartTrigger.setAttribute("aria-expanded", "true");
  overlay.hidden = false;
  document.body.classList.add("cart-is-open");
}

function closeCart() {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartTrigger.setAttribute("aria-expanded", "false");
  overlay.hidden = true;
  document.body.classList.remove("cart-is-open");
}

function showCheckout() {
  cartBody.hidden = true;
  cartSummary.hidden = true;
  checkoutView.hidden = false;
}

function showCart() {
  cartBody.hidden = false;
  checkoutView.hidden = true;
  renderCart();
}

function setFieldError(id, message) {
  const error = document.querySelector(`#${id}-error`);
  if (error) error.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
  form.querySelectorAll("input").forEach((input) => { input.removeAttribute("aria-invalid"); });
}

function validateContact(form) {
  const name = form.elements.name;
  const phone = form.elements.phone;
  const email = form.elements.email;
  let valid = true;
  clearErrors(form);
  if (name.value.trim().length < 2) { setFieldError("contact-name", "Please enter your name."); name.setAttribute("aria-invalid", "true"); valid = false; }
  if (phone.value.replace(/\D/g, "").length < 9) { setFieldError("contact-phone", "Please enter a valid contact number."); phone.setAttribute("aria-invalid", "true"); valid = false; }
  if (!email.validity.valid || !email.value) { setFieldError("contact-email", "Please enter a valid email address."); email.setAttribute("aria-invalid", "true"); valid = false; }
  return valid;
}

function validateCheckout(form) {
  const name = form.elements.name;
  const phone = form.elements.phone;
  let valid = true;
  clearErrors(form);
  if (name.value.trim().length < 2) { setFieldError("checkout-name", "Please enter your name."); name.setAttribute("aria-invalid", "true"); valid = false; }
  if (phone.value.replace(/\D/g, "").length < 9) { setFieldError("checkout-phone", "Please enter a valid phone number."); phone.setAttribute("aria-invalid", "true"); valid = false; }
  return valid;
}

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-item]");
  if (button) addToCart(button.dataset.addItem);
});

cartBody.addEventListener("click", (event) => {
  const increaseButton = event.target.closest("[data-increase-item]");
  const decreaseButton = event.target.closest("[data-decrease-item]");
  const browseMenu = event.target.closest("#browse-menu");
  if (increaseButton) changeQuantity(increaseButton.dataset.increaseItem, 1);
  if (decreaseButton) changeQuantity(decreaseButton.dataset.decreaseItem, -1);
  if (browseMenu) closeCart();
});

cartTrigger.addEventListener("click", () => cartPanel.classList.contains("is-open") ? closeCart() : openCart());
cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
checkoutButton.addEventListener("click", showCheckout);
backToCart.addEventListener("click", showCart);

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#contact-status");
  if (!validateContact(form)) { status.className = "form-status error"; status.textContent = "Please check the highlighted fields."; return; }
  form.reset();
  status.className = "form-status success";
  status.textContent = "Thank you for contacting Brew Bliss Cafe!";
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#checkout-status");
  if (!validateCheckout(form)) { status.className = "form-status error"; status.textContent = "Please check the highlighted fields."; return; }
  const orderNumber = Math.floor(1000 + Math.random() * 9000);
  form.reset();
  cart.clear();
  cartBody.hidden = false;
  checkoutView.hidden = true;
  cartSummary.hidden = true;
  cartBody.innerHTML = `<div class="cart-empty"><span aria-hidden="true">&#10003;</span><h3>Order received</h3><p>Thank you for ordering from Brew Bliss Cafe. Order #${orderNumber} will be ready for pickup soon.</p><a href="#menu" class="text-link" id="browse-menu">Order something else <span aria-hidden="true">&#8594;</span></a></div>`;
  document.querySelector("#cart-count").textContent = "0";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderMenu();
renderCart();
