const products = [
  {name:"Premium Navy Wash & Wear", type:"Wash & Wear", price:2499, tag:"BEST SELLER"},
  {name:"Classic Black Wash & Wear", type:"Wash & Wear", price:2299, tag:"TRENDING"},
  {name:"Royal Blue Premium Fabric", type:"Wash & Wear", price:2799, tag:"NEW"},
  {name:"Charcoal Grey Wash & Wear", type:"Wash & Wear", price:2599, tag:""},
  {name:"Classic Brown Khaddar", type:"Khaddar", price:2199, tag:"WINTER"},
  {name:"Deep Black Khaddar", type:"Khaddar", price:2399, tag:"BEST SELLER"},
  {name:"Warm Navy Khaddar", type:"Khaddar", price:2699, tag:"NEW"},
  {name:"Premium Beige Khaddar", type:"Khaddar", price:2499, tag:""}
];

let cart = JSON.parse(localStorage.getItem("hmFabricsCart") || "[]");

function card(p) {
  const index = products.indexOf(p);
  const kh = p.type === "Khaddar" ? " kh" : "";

  return `
    <article class="product-card">
      <div class="product-img">
        <span class="fabric${kh}"></span>
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
        <button class="wishlist-btn" onclick="event.stopPropagation(); alert('Wishlist feature coming soon ❤️')">♡</button>
      </div>

      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.type} • 4 Meter / 4.5 Meter</p>
        <strong>Rs. ${p.price.toLocaleString()}</strong>

        <div class="product-actions">
          <button class="quick-btn" onclick="quickView(${index})">
            QUICK VIEW
          </button>

          <button class="cart-btn" onclick="addCart(${index})">
            ADD TO CART
          </button>
        </div>
      </div>
    </article>
  `;
}

function render(id, list) {
  const element = document.getElementById(id);

  if (element) {
    element.innerHTML = list.map(card).join("");
  }
}

render("washGrid", products.filter(p => p.type === "Wash & Wear"));
render("khaddarGrid", products.filter(p => p.type === "Khaddar"));
render("newGrid", products.filter(p => ["NEW", "TRENDING"].includes(p.tag)));
render("bestGrid", products.filter(p => ["BEST SELLER", "TRENDING"].includes(p.tag)));

function saveCart() {
  localStorage.setItem("hmFabricsCart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = count;
  }
}

function addCart(index) {
  const product = products[index];

  const existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      type: product.type,
      price: product.price,
      quantity: 1,
      length: "4 Meter"
    });
  }

  saveCart();
  updateCartCount();

  alert(`${product.name} cart mein add ho gaya! 🛒`);
}

function removeCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  openCart();
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartCount();
  openCart();
}

function cartTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function openCart() {
  let modal = document.getElementById("hmCartModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "hmCartModal";

    modal.style.cssText = `
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.65);
      z-index:99999;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      font-family:Arial,sans-serif;
    `;

    document.body.appendChild(modal);
  }

  let itemsHTML = "";

  if (cart.length === 0) {
    itemsHTML = `
      <div style="text-align:center;padding:40px 10px;">
        <div style="font-size:50px;">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Add some beautiful HM Fabrics products.</p>
      </div>
    `;
  } else {
    itemsHTML = cart.map((item, index) => `
      <div style="
        border-bottom:1px solid #ddd;
        padding:15px 0;
        display:flex;
        justify-content:space-between;
        gap:10px;
      ">
        <div>
          <strong>${item.name}</strong>
          <div>${item.length}</div>
          <div>Rs. ${item.price.toLocaleString()}</div>

          <div style="margin-top:8px;">
            <button onclick="changeQuantity(${index},-1)">−</button>
            <span style="padding:0 12px;">${item.quantity}</span>
            <button onclick="changeQuantity(${index},1)">+</button>
          </div>
        </div>

        <button
          onclick="removeCart(${index})"
          style="
            height:32px;
            border:0;
            background:#eee;
            cursor:pointer;
          "
        >
          Remove
        </button>
      </div>
    `).join("");
  }

  modal.innerHTML = `
    <div style="
      background:white;
      width:min(600px,100%);
      max-height:90vh;
      overflow:auto;
      border-radius:14px;
      padding:25px;
      position:relative;
    ">

      <button
        onclick="closeCart()"
        style="
          position:absolute;
          right:15px;
          top:12px;
          border:0;
          background:none;
          font-size:28px;
          cursor:pointer;
        "
      >×</button>

      <h2>🛒 HM Fabrics Cart</h2>

      ${itemsHTML}

      ${
        cart.length
          ? `
            <div style="
              display:flex;
              justify-content:space-between;
              margin-top:20px;
              font-size:20px;
              font-weight:bold;
            ">
              <span>Total</span>
              <span>Rs. ${cartTotal().toLocaleString()}</span>
            </div>

            <button
              onclick="checkout()"
              style="
                width:100%;
                margin-top:20px;
                padding:15px;
                border:0;
                border-radius:8px;
                background:#111;
                color:white;
                font-size:16px;
                cursor:pointer;
              "
            >
              PROCEED TO CHECKOUT
            </button>
          `
          : ""
      }

    </div>
  `;
}

function closeCart() {
  const modal = document.getElementById("hmCartModal");

  if (modal) {
    modal.remove();
  }
}
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const modal = document.getElementById("hmCartModal");

  modal.innerHTML = `
    <div style="
      background:white;
      width:min(600px,100%);
      max-height:90vh;
      overflow:auto;
      border-radius:14px;
      padding:25px;
    ">

      <h2>📦 HM Fabrics Checkout</h2>

      <p><strong>Cash on Delivery</strong> available across Pakistan.</p>

      <input
        id="customerName"
        placeholder="Full Name"
        style="width:100%;padding:13px;margin:7px 0;box-sizing:border-box;"
      >

      <input
        id="customerPhone"
        placeholder="Phone Number"
        type="tel"
        style="width:100%;padding:13px;margin:7px 0;box-sizing:border-box;"
      >

      <input
        id="customerCity"
        placeholder="City"
        style="width:100%;padding:13px;margin:7px 0;box-sizing:border-box;"
      >

      <textarea
        id="customerAddress"
        placeholder="Complete Delivery Address"
        rows="4"
        style="width:100%;padding:13px;margin:7px 0;box-sizing:border-box;"
      ></textarea>

      <button
        onclick="placeWhatsAppOrder()"
        style="
          width:100%;
          padding:15px;
          margin-top:10px;
          border:0;
          border-radius:8px;
          background:#25D366;
          color:white;
          font-size:16px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        💬 PLACE COD ORDER ON WHATSAPP
      </button>

      <button
        onclick="openCart()"
        style="
          width:100%;
          padding:12px;
          margin-top:10px;
          border:1px solid #ddd;
          background:white;
          border-radius:8px;
          cursor:pointer;
        "
      >
        ← Back to Cart
      </button>

    </div>
  `;
}

function placeWhatsAppOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const city = document.getElementById("customerCity").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !city || !address) {
    alert("Please fill all customer details.");
    return;
  }

  let message = "🛍️ NEW HM FABRICS ORDER\n\n";

  message += `👤 Name: ${name}\n`;
  message += `📱 Phone: ${phone}\n`;
  message += `🏙️ City: ${city}\n`;
  message += `📍 Address: ${address}\n\n`;

  message += "🧵 PRODUCTS:\n";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Length: ${item.length}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: Rs. ${(item.price * item.quantity).toLocaleString()}\n\n`;
  });

  message += `💰 TOTAL: Rs. ${cartTotal().toLocaleString()}\n`;
  message += `💵 Payment: Cash on Delivery`;

  const whatsappNumber = "923217896089";

  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(whatsappURL, "_blank");

  cart = [];
  saveCart();
  updateCartCount();
}

function quickView(index) {
  const product = products[index];

  alert(
    `${product.name}\n\n` +
    `Type: ${product.type}\n` +
    `Price: Rs. ${product.price.toLocaleString()}\n` +
    `Available Lengths: 4 Meter / 4.5 Meter\n\n` +
    `Premium unstitched men's fabric.`
  );
}


/* CART BUTTON */

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {
  cartBtn.addEventListener("click", openCart);
}


/* MOBILE MENU */

const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

document.querySelectorAll(".main-nav a").forEach(a => {
  a.addEventListener("click", () => {
    if (mainNav) {
      mainNav.classList.remove("open");
    }
  });
});


/* SEARCH */

const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");

if (searchBtn && searchPanel) {
  searchBtn.addEventListener("click", () => {
    searchPanel.classList.toggle("open");
  });
}


/* BACK TO TOP */

const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
  if (backTop) {
    backTop.classList.toggle("show", window.scrollY > 600);
  }
});

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* START */

updateCartCount();
