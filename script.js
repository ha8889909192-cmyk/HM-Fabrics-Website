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

const GOOGLE_SHEET_API =
  "https://script.google.com/macros/s/AKfycbzXEo5rwVoVTSky5Z7waUoMwAGFQ1u3F_4G0ekCbXGvFY_jFuPcX9tMCQdimC8bld2HMw/exec";

let cart = JSON.parse(localStorage.getItem("hmFabricsCart") || "[]");

function card(p) {
  const index = products.indexOf(p);
  const kh = p.type === "Khaddar" ? " kh" : "";

  return `
    <article class="product-card">
      <div class="product-img">
        <span class="fabric${kh}"></span>
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}

        <button
          class="wishlist-btn"
          onclick="event.stopPropagation(); alert('Wishlist feature coming soon')">
          ♡
        </button>
      </div>

      <div class="product-info">
        <h3>${p.name}</h3>

        <p>
          ${p.type} • 4 Meter / 4.5 Meter
        </p>

        <strong>
          Rs. ${p.price.toLocaleString()}
        </strong>

        <div class="product-actions">

          <button
            class="quick-btn"
            onclick="quickView(${index})">
            QUICK VIEW
          </button>

          <button
            class="cart-btn"
            onclick="addCart(${index})">
            ADD TO CART
          </button>

          <button
            class="cart-btn"
            onclick="buyNow(${index})">
            BUY NOW
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

render(
  "washGrid",
  products.filter(p => p.type === "Wash & Wear")
);

render(
  "khaddarGrid",
  products.filter(p => p.type === "Khaddar")
);

render(
  "newGrid",
  products.filter(p => ["NEW", "TRENDING"].includes(p.tag))
);

render(
  "bestGrid",
  products.filter(p => ["BEST SELLER", "TRENDING"].includes(p.tag))
);

function saveCart() {
  localStorage.setItem(
    "hmFabricsCart",
    JSON.stringify(cart)
  );
}

function updateCartCount() {
  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = count;
  }
}

function addCart(index) {
  const product = products[index];

  const existing = cart.find(
    item => item.name === product.name
  );

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

  alert(product.name + " cart mein add ho gaya!");
}

function buyNow(index) {
  const product = products[index];

  cart = [{
    name: product.name,
    type: product.type,
    price: product.price,
    quantity: 1,
    length: "4 Meter"
  }];

  saveCart();
  updateCartCount();

  checkout();
}

function removeCart(index) {
  cart.splice(index, 1);

  saveCart();
  updateCartCount();

  openCart();
}

function changeQuantity(index, amount) {

  if (!cart[index]) {
    return;
  }

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
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
}

function openCart() {

  let modal =
    document.getElementById("hmCartModal");

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
        <div style="font-size:50px;">Cart</div>
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

          <div>
            Fabric Length:
            ${item.length}
          </div>

          <div>
            Rs. ${item.price.toLocaleString()}
          </div>

          <div style="margin-top:8px;">

            <button
              onclick="changeQuantity(${index},-1)">
              -
            </button>

            <span style="padding:0 12px;">
              ${item.quantity}
            </span>

            <button
              onclick="changeQuantity(${index},1)">
              +
            </button>

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
      >
        ×
      </button>

      <h2>HM Fabrics Cart</h2>

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

            <span>
              Rs. ${cartTotal().toLocaleString()}
            </span>

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

  const modal =
    document.getElementById("hmCartModal");

  if (modal) {
    modal.remove();
  }
}function checkout() {

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
      box-sizing:border-box;
    ">

      <button
        onclick="closeCart()"
        style="
          float:right;
          border:0;
          background:none;
          font-size:28px;
          cursor:pointer;
        "
      >
        ×
      </button>

      <h2>HM Fabrics Checkout</h2>

      <p>
        <strong>Cash on Delivery</strong>
        available across Pakistan.
      </p>

      <input
        id="customerName"
        placeholder="Full Name"
        style="
          width:100%;
          padding:13px;
          margin:7px 0;
          box-sizing:border-box;
        "
      >

      <input
        id="customerPhone"
        placeholder="Phone Number"
        type="tel"
        style="
          width:100%;
          padding:13px;
          margin:7px 0;
          box-sizing:border-box;
        "
      >

      <input
        id="customerCity"
        placeholder="City"
        style="
          width:100%;
          padding:13px;
          margin:7px 0;
          box-sizing:border-box;
        "
      >

      <textarea
        id="customerAddress"
        placeholder="Complete Delivery Address"
        rows="4"
        style="
          width:100%;
          padding:13px;
          margin:7px 0;
          box-sizing:border-box;
        "
      ></textarea>

      <h3>Order Details</h3>

      <div>
        ${cart.map((item, index) => `

          <div style="
            border:1px solid #ddd;
            border-radius:10px;
            padding:14px;
            margin:10px 0;
          ">

            <strong>${item.name}</strong>

            <p>
              Price:
              Rs. ${item.price.toLocaleString()}
            </p>

            <label>
              Fabric Length
            </label>

            <select
              id="length_${index}"
              onchange="updateItemLength(${index}, this.value)"
              style="
                width:100%;
                padding:10px;
                margin-top:6px;
              "
            >

              <option value="4 Meter">
                4 Meter
              </option>

              <option value="4.5 Meter">
                4.5 Meter
              </option>

              <option value="5 Meter">
                5 Meter
              </option>

              <option value="6 Meter">
                6 Meter
              </option>

              <option value="Other">
                Other
              </option>

            </select>

            <div style="margin-top:10px;">

              Quantity:

              <button
                type="button"
                onclick="checkoutQuantity(${index}, -1)"
              >
                −
              </button>

              <span
                id="checkoutQty_${index}"
                style="padding:0 12px;"
              >
                ${item.quantity}
              </span>

              <button
                type="button"
                onclick="checkoutQuantity(${index}, 1)"
              >
                +
              </button>

            </div>

            <p>
              Subtotal:
              Rs.
              ${(item.price * item.quantity).toLocaleString()}
            </p>

          </div>

        `).join("")}
      </div>

      <div style="
        display:flex;
        justify-content:space-between;
        font-size:20px;
        font-weight:bold;
        margin-top:20px;
      ">

        <span>
          Total
        </span>

        <span>
          Rs. ${cartTotal().toLocaleString()}
        </span>

      </div>

      <button
        id="placeOrderButton"
        onclick="placeOrder()"
        style="
          width:100%;
          padding:15px;
          margin-top:20px;
          border:0;
          border-radius:8px;
          background:#111;
          color:white;
          font-size:16px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        PLACE COD ORDER
      </button>

      <p style="
        text-align:center;
        font-size:12px;
        color:#777;
        margin-top:12px;
      ">
        Your order will be saved securely.
        WhatsApp is available for support only.
      </p>

    </div>
  `;

  cart.forEach((item, index) => {

    const select =
      document.getElementById(`length_${index}`);

    if (select) {
      select.value =
        item.length || "4 Meter";
    }

  });
}


function updateItemLength(index, value) {

  if (!cart[index]) {
    return;
  }

  if (value === "Other") {

    const customLength =
      prompt(
        "Enter fabric length in meters:",
        "5"
      );

    if (customLength) {

      cart[index].length =
        customLength + " Meter";

    } else {

      cart[index].length =
        "4 Meter";

    }

  } else {

    cart[index].length = value;

  }

  saveCart();
}


function checkoutQuantity(index, amount) {

  if (!cart[index]) {
    return;
  }

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {

    cart.splice(index, 1);

    saveCart();
    updateCartCount();

    if (cart.length === 0) {

      closeCart();

    } else {

      checkout();

    }

    return;
  }

  saveCart();
  updateCartCount();
  checkout();
}


async function placeOrder() {

  const name =
    document.getElementById("customerName")
      .value.trim();

  const phone =
    document.getElementById("customerPhone")
      .value.trim();

  const city =
    document.getElementById("customerCity")
      .value.trim();

  const address =
    document.getElementById("customerAddress")
      .value.trim();

  if (!name || !phone || !city || !address) {

    alert(
      "Please fill Full Name, Phone Number, City and Complete Address."
    );

    return;
  }

  const button =
    document.getElementById("placeOrderButton");

  if (button) {

    button.disabled = true;
    button.textContent =
      "PLACING ORDER...";

  }

  try {

    const orderIds = [];

    for (const item of cart) {

      const orderData = {

        customerName: name,

        phone: phone,

        city: city,

        completeAddress: address,

        product: item.name,

        quantity: item.quantity,

        fabricLength:
          item.length || "4 Meter",

        totalAmount:
          item.price * item.quantity,

        payment:
          "Cash on Delivery"

      };

      const response =
        await fetch(
          GOOGLE_SHEET_API,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(orderData)
          }
        );

      const result =
        await response.json();

      if (!result.success) {

        throw new Error(
          result.message ||
          "Order could not be saved."
        );

      }

      if (result.orderId) {

        orderIds.push(
          result.orderId
        );

      }

    }

    cart = [];

    saveCart();
    updateCartCount();

    const modal =
      document.getElementById(
        "hmCartModal"
      );

    modal.innerHTML = `

      <div style="
        background:white;
        width:min(550px,100%);
        border-radius:14px;
        padding:30px;
        text-align:center;
        box-sizing:border-box;
      ">

        <div style="
          font-size:55px;
        ">
          ✓
        </div>

        <h2>
          Order Placed Successfully!
        </h2>

        <p>
          Thank you,
          <strong>${name}</strong>.
        </p>

        <p>
          Your order has been saved successfully.
        </p>

        <div style="
          background:#f5f5f5;
          padding:15px;
          border-radius:8px;
          margin:15px 0;
        ">

          <strong>
            Order ID
          </strong>

          <br>

          ${orderIds.join(", ")}

        </div>

        <p>
          Payment:
          <strong>
            Cash on Delivery
          </strong>
        </p>

        <p>
          Please keep your Order ID
          for order tracking.
        </p>

        <button
          onclick="closeCart()"
          style="
            width:100%;
            padding:14px;
            border:0;
            border-radius:8px;
            background:#111;
            color:white;
            cursor:pointer;
          "
        >
          CONTINUE SHOPPING
        </button>

      </div>

    `;

  } catch (error) {

    console.error(error);

    if (button) {

      button.disabled = false;

      button.textContent =
        "PLACE COD ORDER";

    }

    alert(
      "Order save nahi ho saka. Please internet connection check karein aur dobara try karein."
    );

  }
}


function quickView(index) {

  const product =
    products[index];

  if (!product) {
    return;
  }

  alert(
    product.name +
    "\\n\\nPrice: Rs. " +
    product.price.toLocaleString() +
    "\\n\\nFabric: " +
    product.type +
    "\\n\\nAvailable Length: 4 Meter / 4.5 Meter"
  );
}


function scrollToSection(id) {

  const element =
    document.getElementById(id);

  if (element) {

    element.scrollIntoView({
      behavior: "smooth"
    });

  }

}


function toggleMenu() {

  const menu =
    document.getElementById(
      "mobileMenu"
    );

  if (menu) {

    menu.classList.toggle(
      "active"
    );

  }

}


function closeMobileMenu() {

  const menu =
    document.getElementById(
      "mobileMenu"
    );

  if (menu) {

    menu.classList.remove(
      "active"
    );

  }

}


function openSearch() {

  const search =
    document.getElementById(
      "searchBox"
    );

  if (search) {

    search.classList.add(
      "active"
    );

    const input =
      document.getElementById(
        "searchInput"
      );

    if (input) {
      input.focus();
    }

  }

}


function closeSearch() {

  const search =
    document.getElementById(
      "searchBox"
    );

  if (search) {

    search.classList.remove(
      "active"
    );

  }

}


function searchProducts() {

  const input =
    document.getElementById(
      "searchInput"
    );

  const query =
    input
      ? input.value.toLowerCase().trim()
      : "";

  if (!query) {

    render(
      "washGrid",
      products.filter(
        p => p.type === "Wash & Wear"
      )
    );

    render(
      "khaddarGrid",
      products.filter(
        p => p.type === "Khaddar"
      )
    );

    return;
  }

  const results =
    products.filter(
      p =>
        p.name
          .toLowerCase()
          .includes(query) ||
        p.type
          .toLowerCase()
          .includes(query)
    );

  render(
    "washGrid",
    results
  );

  render(
    "khaddarGrid",
    []
  );

}


function closeSearchOnOutsideClick(event) {

  const search =
    document.getElementById(
      "searchBox"
    );

  if (
    search &&
    event.target === search
  ) {

    closeSearch();

  }

}


function backToTop() {

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


function placeWhatsAppOrder() {

  const whatsappNumber =
    "923217896089";

  const message =
    "Assalam o Alaikum, I need help with my HM Fabrics order.";

  const url =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    url,
    "_blank"
  );

}


function trackOrder() {

  const orderId =
    prompt(
      "Enter your HM Fabrics Order ID:"
    );

  if (!orderId) {
    return;
  }

  const phone =
    prompt(
      "Enter your phone number:"
    );

  if (!phone) {
    return;
  }

  const url =
    GOOGLE_SHEET_API +
    "?action=track" +
    "&orderId=" +
    encodeURIComponent(orderId) +
    "&phone=" +
    encodeURIComponent(phone);

  fetch(url)

    .then(response =>
      response.json()
    )

    .then(data => {

      if (!data.success) {

        alert(
          data.message ||
          "Order not found."
        );

        return;
      }

      const order =
        data.order;

      alert(
        "HM Fabrics Order Tracking\\n\\n" +

        "Order ID: " +
        order.orderId +

        "\\nCustomer: " +
        order.customerName +

        "\\nProduct: " +
        order.product +

        "\\nQuantity: " +
        order.quantity +

        "\\nTotal: Rs. " +
        Number(
          order.totalAmount || 0
        ).toLocaleString() +

        "\\nPayment: " +
        order.payment +

        "\\nStatus: " +
        order.orderStatus +

        "\\nCourier: " +
        (order.courier || "Not assigned") +

        "\\nTracking Number: " +
        (order.trackingNumber || "Not assigned")
      );

    })

    .catch(error => {

      console.error(error);

      alert(
        "Tracking service temporarily unavailable."
      );

    });

}


document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateCartCount();

    const cartButton =
      document.getElementById(
        "cartButton"
      );

    if (cartButton) {

      cartButton.addEventListener(
        "click",
        openCart
      );

    }

    const searchInput =
      document.getElementById(
        "searchInput"
      );

    if (searchInput) {

      searchInput.addEventListener(
        "input",
        searchProducts
      );

    }

    document.addEventListener(
      "click",
      closeSearchOnOutsideClick
    );

  }
);
