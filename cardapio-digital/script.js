// Troque este número pelo WhatsApp do restaurante, usando DDI + DDD + número.
const RESTAURANT_WHATSAPP = "5511971555294";

// Produtos mockados. Para adaptar o cardápio, edite esta lista.
const products = [
  {
    id: 1,
    name: "Pizza Margherita",
    category: "Pizzas",
    description: "Molho artesanal, muçarela, tomate e manjericão fresco.",
    price: 49.9,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Pizza Calabresa",
    category: "Pizzas",
    description: "Calabresa fatiada, cebola roxa, muçarela e orégano.",
    price: 52.9,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Pizza Quatro Queijos",
    category: "Pizzas",
    description: "Muçarela, parmesão, provolone e gorgonzola cremoso.",
    price: 57.9,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Refrigerante 2L",
    category: "Bebidas",
    description: "Coca-Cola, Guaraná ou Sprite gelado para acompanhar.",
    price: 13.9,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Suco Natural",
    category: "Bebidas",
    description: "Laranja, limão ou maracujá preparado na hora.",
    price: 9.9,
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Combo Família",
    category: "Combos",
    description: "Duas pizzas grandes, refrigerante 2L e borda recheada.",
    price: 109.9,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Combo Casal",
    category: "Combos",
    description: "Uma pizza grande, duas bebidas individuais e sobremesa.",
    price: 69.9,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Brownie com Sorvete",
    category: "Sobremesas",
    description: "Brownie quente com sorvete de creme e calda de chocolate.",
    price: 19.9,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Pudim da Casa",
    category: "Sobremesas",
    description: "Pudim cremoso com calda de caramelo artesanal.",
    price: 14.9,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=700&q=80"
  }
];

const state = {
  category: "Todos",
  search: "",
  cart: []
};

const productGrid = document.querySelector("#productGrid");
const productCount = document.querySelector("#productCount");
const categories = document.querySelectorAll(".category");
const searchToggle = document.querySelector("#searchToggle");
const searchBar = document.querySelector("#searchBar");
const searchInput = document.querySelector("#searchInput");
const cartPanel = document.querySelector(".cart-panel");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const mobileCartTotal = document.querySelector("#mobileCartTotal");
const mobileCartButton = document.querySelector("#mobileCartButton");
const checkoutButton = document.querySelector("#checkoutButton");
const checkoutModal = document.querySelector("#checkoutModal");
const closeModal = document.querySelector("#closeModal");
const checkoutForm = document.querySelector("#checkoutForm");

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function getFilteredProducts() {
  const searchTerm = state.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  productCount.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "itens"}`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = '<div class="no-results">Nenhum produto encontrado.</div>';
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map((product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <small>${product.category}</small>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-footer">
            <span class="price">${formatCurrency(product.price)}</span>
            <button class="add-button" type="button" data-id="${product.id}">Adicionar</button>
          </div>
        </div>
      </article>
    `)
    .join("");
}

function getCartTotal() {
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function getCartQuantity() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
  const hasItems = state.cart.length > 0;
  const total = getCartTotal();

  cartEmpty.style.display = hasItems ? "none" : "block";
  cartItems.style.display = hasItems ? "grid" : "none";
  checkoutButton.disabled = !hasItems;
  cartCount.textContent = getCartQuantity();
  cartTotal.textContent = formatCurrency(total);
  mobileCartTotal.textContent = formatCurrency(total);

  cartItems.innerHTML = state.cart
    .map((item) => `
      <article class="cart-item">
        <div class="cart-item-top">
          <div>
            <h3>${item.name}</h3>
            <p>${formatCurrency(item.price)} cada</p>
          </div>
          <button class="remove-item" type="button" data-id="${item.id}" aria-label="Remover ${item.name}">×</button>
        </div>
        <div class="quantity-row">
          <div class="quantity-controls">
            <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
          </div>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </div>
      </article>
    `)
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(productId, action) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;
  }

  state.cart = state.cart.filter((cartItem) => cartItem.quantity > 0);
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  renderCart();
}

function closeMobileCart() {
  cartPanel.classList.remove("open");
  document.body.classList.remove("cart-open");
}

function openCheckoutModal() {
  if (state.cart.length === 0) return;

  closeMobileCart();
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelector("#customerName").focus();
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function createWhatsAppMessage(formData) {
  const items = state.cart
    .map((item) => `- ${item.name} x ${item.quantity} - ${formatCurrency(item.price * item.quantity)}`)
    .join("\n");

  return `Olá, gostaria de fazer um pedido:

Nome: ${formData.name}
Endereço: ${formData.address}
Forma de pagamento: ${formData.payment}

Itens:
${items}

Observações: ${formData.notes || "Nenhuma"}
Total: ${formatCurrency(getCartTotal())}`;
}

function sendOrderToWhatsApp(event) {
  event.preventDefault();

  const formData = {
    name: document.querySelector("#customerName").value.trim(),
    address: document.querySelector("#customerAddress").value.trim(),
    payment: document.querySelector("#paymentMethod").value,
    notes: document.querySelector("#orderNotes").value.trim()
  };

  const message = createWhatsAppMessage(formData);
  const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
  closeCheckoutModal();
}

categories.forEach((categoryButton) => {
  categoryButton.addEventListener("click", () => {
    categories.forEach((button) => button.classList.remove("active"));
    categoryButton.classList.add("active");
    state.category = categoryButton.dataset.category;
    renderProducts();
  });
});

searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("open");
  if (searchBar.classList.contains("open")) {
    searchInput.focus();
  }
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-button");
  if (!addButton) return;

  addToCart(Number(addButton.dataset.id));
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-item");
  const quantityButton = event.target.closest("[data-action]");

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.id));
  }

  if (quantityButton) {
    updateQuantity(Number(quantityButton.dataset.id), quantityButton.dataset.action);
  }
});

mobileCartButton.addEventListener("click", () => {
  const isOpen = cartPanel.classList.toggle("open");
  document.body.classList.toggle("cart-open", isOpen);
});

document.addEventListener("click", (event) => {
  const isCartOpen = cartPanel.classList.contains("open");
  const clickedInsideCart = cartPanel.contains(event.target);
  const clickedCartButton = mobileCartButton.contains(event.target);

  if (isCartOpen && !clickedInsideCart && !clickedCartButton) {
    closeMobileCart();
  }
});

checkoutButton.addEventListener("click", openCheckoutModal);
closeModal.addEventListener("click", closeCheckoutModal);
checkoutForm.addEventListener("submit", sendOrderToWhatsApp);

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    closeCheckoutModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCheckoutModal();
    closeMobileCart();
  }
});

renderProducts();
renderCart();
