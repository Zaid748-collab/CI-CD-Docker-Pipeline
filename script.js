#hey
#hey
#hey
const products = [
  {
    id: "linen-shirt",
    name: "Linen Camp Shirt",
    price: 48,
    description: "A breathable short-sleeve shirt with a relaxed fit for warm days.",
  },
  {
    id: "canvas-jacket",
    name: "Canvas Chore Jacket",
    price: 86,
    description: "A sturdy layer with roomy pockets and a soft cotton lining.",
  },
  {
    id: "straight-jeans",
    name: "Straight Leg Jeans",
    price: 64,
    description: "Classic denim with a comfortable mid-rise waist and clean finish.",
  },
  {
    id: "ribbed-tee",
    name: "Ribbed Cotton Tee",
    price: 28,
    description: "A soft everyday tee with a neat neckline and gentle stretch.",
  },
];

let cart = [];
let latestOrder = null;

const app = document.querySelector("#app");
const cartCount = document.querySelector("#cart-count");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + product.price * item.quantity;
  }, 0);
}

function updateCartCount() {
  cartCount.textContent = getCartItemCount();
}

function imagePlaceholder(name) {
  return `<div class="image-placeholder" aria-label="${name} image placeholder">Image placeholder</div>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <span class="eyebrow">Small batch essentials</span>
      <h1>Thread & Form Clothing</h1>
      <p class="lead">Simple, comfortable pieces for a clean everyday wardrobe. Browse our current selection and add your favorites to the cart.</p>
    </section>

    <section class="product-grid" aria-label="Product selection">
      ${products
        .map(
          (product) => `
            <article class="product-card">
              ${imagePlaceholder(product.name)}
              <div class="product-body">
                <h2>${product.name}</h2>
                <p class="price">${formatPrice(product.price)}</p>
                <p class="description">${product.description}</p>
                <div class="card-actions">
                  <button class="secondary-button" type="button" data-product-details="${product.id}">View details</button>
                  <button class="primary-button" type="button" data-add-product="${product.id}">Add to cart</button>
                </div>
              </div>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderProductDetails(productId) {
  const product = getProduct(productId);

  if (!product) {
    renderHome();
    return;
  }

  app.innerHTML = `
    <section class="detail-panel">
      ${imagePlaceholder(product.name)}
      <div class="detail-copy">
        <span class="eyebrow">Product details</span>
        <h1>${product.name}</h1>
        <p class="price">${formatPrice(product.price)}</p>
        <p class="description">${product.description}</p>
        <p class="description">Designed for easy outfit building, this piece pairs well with the rest of the Thread & Form collection.</p>
        <div class="detail-actions">
          <button class="primary-button" type="button" data-add-product="${product.id}">Add to cart</button>
          <button class="secondary-button" type="button" data-view="home">Back to shop</button>
        </div>
      </div>
    </section>
  `;
}

function renderCart() {
  if (cart.length === 0) {
    app.innerHTML = `
      <section class="cart-panel">
        <h1>Your cart</h1>
        <div class="empty-state">
          <p>Your cart is empty.</p>
          <button class="primary-button" type="button" data-view="home">Continue shopping</button>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="cart-panel">
      <h1>Your cart</h1>
      <ul class="cart-list">
        ${cart
          .map((item) => {
            const product = getProduct(item.productId);
            return `
              <li class="cart-item">
                <div>
                  <h2>${product.name}</h2>
                  <p class="price">${formatPrice(product.price)}</p>
                  <p class="description">${product.description}</p>
                </div>
                <div>
                  <label class="quantity-control">
                    Quantity
                    <input type="number" min="1" value="${item.quantity}" data-quantity-product="${product.id}" />
                  </label>
                  <button class="danger-button" type="button" data-remove-product="${product.id}">Remove</button>
                </div>
              </li>
            `;
          })
          .join("")}
      </ul>
      <div class="cart-summary">
        <span>Total</span>
        <span>${formatPrice(getCartTotal())}</span>
      </div>
      <div class="cart-actions">
        <button class="primary-button" type="button" data-view="checkout">Checkout</button>
        <button class="secondary-button" type="button" data-view="home">Continue shopping</button>
      </div>
    </section>
  `;
}

function renderCheckout() {
  if (cart.length === 0) {
    renderCart();
    return;
  }

  app.innerHTML = `
    <section class="checkout-panel">
      <span class="eyebrow">Checkout</span>
      <h1>Delivery details</h1>
      <p class="lead">No accounts or payments here. Add your delivery details to place this sample order.</p>
      <form class="checkout-form" id="checkout-form">
        <div class="form-field">
          <label for="customer-name">Customer name</label>
          <input id="customer-name" name="customerName" type="text" required autocomplete="name" />
        </div>
        <div class="form-field">
          <label for="email">Email address</label>
          <input id="email" name="email" type="email" required autocomplete="email" />
        </div>
        <div class="form-field">
          <label for="delivery-address">Delivery address</label>
          <textarea id="delivery-address" name="deliveryAddress" rows="5" required autocomplete="street-address"></textarea>
        </div>
        <div class="cart-summary">
          <span>Order total</span>
          <span>${formatPrice(getCartTotal())}</span>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">Place order</button>
          <button class="secondary-button" type="button" data-view="cart">Back to cart</button>
        </div>
      </form>
    </section>
  `;
}

function renderConfirmation() {
  if (!latestOrder) {
    renderHome();
    return;
  }

  app.innerHTML = `
    <section class="confirmation-panel">
      <span class="eyebrow">Order confirmed</span>
      <h1>Thanks, ${escapeHtml(latestOrder.customerName)}.</h1>
      <p class="lead">Your order has been received. A confirmation has been prepared for ${escapeHtml(latestOrder.email)}.</p>
      <p><strong>Delivery address:</strong><br>${escapeHtml(latestOrder.deliveryAddress).replace(/\n/g, "<br>")}</p>
      <p><strong>Total:</strong> ${formatPrice(latestOrder.total)}</p>
      <button class="primary-button" type="button" data-view="home">Back to shop</button>
    </section>
  `;
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  updateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  updateCartCount();
  renderCart();
}

function changeQuantity(productId, quantity) {
  const item = cart.find((cartItem) => cartItem.productId === productId);

  if (!item) {
    return;
  }

  item.quantity = Math.max(1, quantity);
  updateCartCount();
  renderCart();
}

function showView(view, productId) {
  const views = {
    home: renderHome,
    cart: renderCart,
    checkout: renderCheckout,
    confirmation: renderConfirmation,
  };

  if (view === "details") {
    renderProductDetails(productId);
  } else {
    views[view]();
  }

  app.focus();
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  const detailsButton = event.target.closest("[data-product-details]");
  const addButton = event.target.closest("[data-add-product]");
  const removeButton = event.target.closest("[data-remove-product]");

  if (viewButton) {
    showView(viewButton.dataset.view);
  }

  if (detailsButton) {
    showView("details", detailsButton.dataset.productDetails);
  }

  if (addButton) {
    addToCart(addButton.dataset.addProduct);
    showView("cart");
  }

  if (removeButton) {
    removeFromCart(removeButton.dataset.removeProduct);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-quantity-product]")) {
    changeQuantity(event.target.dataset.quantityProduct, Number(event.target.value));
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "checkout-form") {
    return;
  }

  event.preventDefault();
  const formData = new FormData(event.target);

  latestOrder = {
    customerName: formData.get("customerName"),
    email: formData.get("email"),
    deliveryAddress: formData.get("deliveryAddress"),
    total: getCartTotal(),
  };

  cart = [];
  updateCartCount();
  showView("confirmation");
});

updateCartCount();
renderHome();
