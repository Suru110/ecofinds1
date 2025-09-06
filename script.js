let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = localStorage.getItem("currentUser");

let defaultProducts = [
  {
    title: "Laptop",
    category: "Electronics",
    price: 15000,
    desc: "Used laptop in good condition.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=60"
  },
  {
    title: "Wooden Chair",
    category: "Furniture",
    price: 1200,
    desc: "Strong and durable wooden chair.",
    image: "https://images.unsplash.com/photo-1616627562245-749f49fba7fa?auto=format&fit=crop&w=600&q=60"
  },
  {
    title: "Book Bundle",
    category: "Books",
    price: 500,
    desc: "Set of 5 novels for book lovers.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=60"
  },
  {
    title: "Bicycle",
    category: "Sports",
    price: 3500,
    desc: "Second-hand bicycle in excellent condition.",
    image: "https://images.unsplash.com/photo-1622373048889-9a7b1eaeedce?auto=format&fit=crop&w=600&q=60"
  }
];

let products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let purchases = JSON.parse(localStorage.getItem("purchases")) || [];

window.onload = function() {
  if (currentUser) {
    document.getElementById("status").innerText = "Welcome back, " + currentUser;
    showPage("marketplace");
  } else {
    showPage("login");
  }
};

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
  if (id === "marketplace") displayItems(products);
  if (id === "cart") displayCart();
  if (id === "purchases") displayPurchases();
}

function login() {
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  if (!users[email]) {
    users[email] = { password: pass, username: email };
    alert("New user registered!");
  } else if (users[email].password !== pass) {
    alert("Wrong password!");
    return;
  }

  currentUser = email;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", currentUser);

  document.getElementById("status").innerText = "Logged in as " + email;
  showPage("marketplace");
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUser = null;
  alert("Logged out!");
  showPage("login");
}

function saveProfile() {
  let uname = document.getElementById("username").value;
  if (currentUser) {
    users[currentUser].username = uname;
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("profileInfo").innerText = "Username: " + uname;
  }
}

function addProduct() {
  let title = document.getElementById("pTitle").value;
  let category = document.getElementById("pCategory").value;
  let price = document.getElementById("pPrice").value;
  let desc = document.getElementById("pDesc").value;
  let imageFile = document.getElementById("pImage").files[0];

  let reader = new FileReader();
  reader.onload = function(e) {
    products.push({ title, category, price, desc, image: e.target.result });
    localStorage.setItem("products", JSON.stringify(products));
    alert("Product added!");
    showPage("marketplace");
  };
  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    products.push({ title, category, price, desc, image: "https://via.placeholder.com/300x200?text=Product" });
    localStorage.setItem("products", JSON.stringify(products));
    alert("Product added!");
    showPage("marketplace");
  }
}

function displayItems(list) {
  let container = document.getElementById("items");
  container.innerHTML = "";
  list.forEach((p, i) => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>${p.category} | ₹${p.price}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>`;
  });
}

function searchItems() {
  let q = document.getElementById("search").value.toLowerCase();
  displayItems(products.filter(p => p.title.toLowerCase().includes(q)));
}

function filterItems() {
  let c = document.getElementById("filter").value;
  if (c === "all") displayItems(products);
  else displayItems(products.filter(p => p.category === c));
}

function addToCart(i) {
  cart.push(products[i]);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

function displayCart() {
  let c = document.getElementById("cartItems");
  c.innerHTML = "";
  cart.forEach((p) => {
    c.innerHTML += `<div class="card"><h4>${p.title}</h4><p>₹${p.price}</p></div>`;
  });
}

function checkout() {
  purchases.push(...cart);
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("purchases", JSON.stringify(purchases));
  alert("Checkout complete!");
  showPage("purchases");
}

function displayPurchases() {
  let p = document.getElementById("purchaseItems");
  p.innerHTML = "";
  purchases.forEach(prod => {
    p.innerHTML += `<div class="card"><h4>${prod.title}</h4><p>₹${prod.price}</p></div>`;
  });
}
