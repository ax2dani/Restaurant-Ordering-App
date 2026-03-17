import { menuArray } from "./data.js";

const menuContainer = document.getElementById("menu-container");
const orderSection = document.getElementById("order-section");
const orderItemsContainer = document.getElementById("order-items");
const totalPriceEl = document.getElementById("total-price");
const discountContainer = document.getElementById("discount-container");
const successContainer = document.getElementById("success-container");
const paymentModal = document.getElementById("modal");
const themeBtn = document.getElementById("theme-btn");

let basket = [];

// Theme Toggle Logic
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️"
    : "🌙";
});

document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    addItem(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    removeItem(e.target.dataset.remove);
  } else if (e.target.id === "complete-order-btn") {
    paymentModal.classList.remove("hidden");
  } else if (e.target.dataset.star) {
    handleRating(e.target.dataset.star);
  }
  // Close modal if clicking outside the white box
  else if (e.target === paymentModal) {
    paymentModal.classList.add("hidden");
  }
});

document.getElementById("payment-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = new FormData(this).get("userName");
    paymentModal.classList.add("hidden");
    orderSection.classList.add("hidden");
    basket = [];

    successContainer.innerHTML = `
        <p>Thanks, ${name}! Your order is on its way!</p>
        <div class="stars">
            <span data-star="1">⭐</span><span data-star="2">⭐</span>
            <span data-star="3">⭐</span><span data-star="4">⭐</span>
            <span data-star="5">⭐</span>
        </div>
    `;
    successContainer.classList.remove("hidden");
  });

function addItem(id) {
  const item = menuArray.find((item) => item.id == id);
  basket.push({ ...item, uuid: crypto.randomUUID() });
  successContainer.classList.add("hidden");
  renderOrder();
}

function removeItem(uuid) {
  basket = basket.filter((item) => item.uuid !== uuid);
  renderOrder();
}

function handleRating(rating) {
  const stars = document.querySelectorAll("[data-star]");
  stars.forEach((star) => {
    star.classList.toggle("star-off", star.dataset.star > rating);
  });
}

function renderOrder() {
  if (basket.length === 0) {
    orderSection.classList.add("hidden");
    return;
  }

  orderSection.classList.remove("hidden");
  let orderHtml = "";
  let total = 0;

  const hasBurger = basket.some((i) => i.id === 1);
  const hasBeer = basket.some((i) => i.id === 2);

  basket.forEach((item) => {
    orderHtml += `
            <div class="order-item">
                <p>${item.name}<button class="remove-btn" data-remove="${item.uuid}">remove</button></p>
                <p>$${item.price}</p>
            </div>`;
    total += item.price;
  });

  if (hasBurger && hasBeer) {
    const discount = total * 0.2;
    total -= discount;
    discountContainer.innerHTML = `<p style="color: #16DB99; margin: 0;">Meal Deal (20% off): -$${discount.toFixed(2)}</p>`;
  } else {
    discountContainer.innerHTML = "";
  }

  orderItemsContainer.innerHTML = orderHtml;
  totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

function renderMenu() {
  menuContainer.innerHTML = menuArray
    .map(
      (item) => `
        <div class="menu-item">
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-details">
                <h2>${item.name}</h2>
                <p>${item.ingredients.join(", ")}</p>
                <p>$${item.price}</p>
            </div>
            <button class="add-btn" data-add="${item.id}">+</button>
        </div>
    `,
    )
    .join("");
}

renderMenu();
