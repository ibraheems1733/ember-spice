/* =========================================================
   EMBER SPICE
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL = "https://ksfxfeuekhnrzdazyydo.supabase.co";
const SUPABASE_KEY = "sb_publishable_69Z26Qo7qtC2QEY1PVuOsw_g0ZALwMd";

const supabaseConfigured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_KEY.startsWith("sb_") &&
    !SUPABASE_URL.includes("PASTE_") &&
    !SUPABASE_KEY.includes("PASTE_");

const supabaseClient = supabaseConfigured
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    )
    : null;


/* =========================================================
   MENU
========================================================= */

const menu = [
    {
        id: 1,
        name: "Classic Chicken Burger",
        price: 149,
        description: "Crispy chicken, lettuce and signature sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 2,
        name: "Ember Loaded Pizza",
        price: 299,
        description: "Cheesy pizza loaded with fresh toppings.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 3,
        name: "Creamy Alfredo Pasta",
        price: 249,
        description: "Creamy pasta with garlic, herbs and parmesan.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 4,
        name: "Fiery Chicken Wrap",
        price: 179,
        description: "Spiced chicken, vegetables and creamy dressing.",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 5,
        name: "Loaded Fries",
        price: 129,
        description: "Crispy fries with cheese and signature sauce.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 6,
        name: "Chocolate Brownie",
        price: 119,
        description: "Warm, rich and fudgy chocolate brownie.",
        image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=900&q=85"
    }
];


/* =========================================================
   CART
========================================================= */

let cart = JSON.parse(
    localStorage.getItem("emberCart") || "[]"
);

const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutTotal = document.getElementById("checkoutTotal");


function money(amount) {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
}


function saveCart() {
    localStorage.setItem(
        "emberCart",
        JSON.stringify(cart)
    );
}


function totalCart() {
    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );
}


/* =========================================================
   MENU DISPLAY
========================================================= */

function renderMenu() {

    menuGrid.innerHTML = menu.map(item => `

        <article class="menu-card">

            <div
                class="menu-image"
                style="background-image:url('${item.image}')"
            ></div>

            <div class="menu-content">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <div class="menu-bottom">

                    <span class="price">
                        ${money(item.price)}
                    </span>

                    <button
                        class="add-button"
                        onclick="addToCart(${item.id})"
                    >
                        Add +
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}


/* =========================================================
   CART
========================================================= */

function addToCart(id) {

    const product = menu.find(
        item => item.id === id
    );

    if (!product) {
        return;
    }

    const existing = cart.find(
        item => item.id === id
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    openCart();
}


function changeQuantity(id, change) {

    const item = cart.find(
        product => product.id === id
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(
            product => product.id !== id
        );
    }

    saveCart();
    renderCart();
}


function renderCart() {

    const count = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    cartCount.textContent = count;

    const total = totalCart();

    cartTotal.textContent = money(total);
    checkoutTotal.textContent = money(total);


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty">
                Your cart is empty.
            </div>
        `;

        return;
    }


    cartItems.innerHTML = cart.map(item => `

        <div class="cart-row">

            <div>

                <h4>${item.name}</h4>

                <small>
                    ${money(item.price)} each
                </small>

                <div class="qty">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

            <strong>
                ${money(item.price * item.quantity)}
            </strong>

        </div>

    `).join("");
}


/* =========================================================
   CART UI
========================================================= */

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");


function openCart() {

    cartDrawer.classList.add("open");
    overlay.classList.add("open");
}


function closeCart() {

    cartDrawer.classList.remove("open");
    overlay.classList.remove("open");
}


document
    .getElementById("openCart")
    .addEventListener("click", openCart);

document
    .getElementById("closeCart")
    .addEventListener("click", closeCart);

overlay.addEventListener(
    "click",
    closeCart
);


/* =========================================================
   CHECKOUT
========================================================= */

const checkoutModal =
    document.getElementById("checkoutModal");

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutStatus =
    document.getElementById("checkoutStatus");


function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    closeCart();

    checkoutStatus.textContent = "";

    checkoutModal.classList.add("open");

    document.body.classList.add("no-scroll");
}


function closeCheckout() {

    checkoutModal.classList.remove("open");

    document.body.classList.remove("no-scroll");
}


document
    .getElementById("checkoutButton")
    .addEventListener(
        "click",
        openCheckout
    );


document
    .getElementById("closeCheckout")
    .addEventListener(
        "click",
        closeCheckout
    );


/* =========================================================
   PLACE REAL ORDER
========================================================= */

checkoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("customerName")
                .value
                .trim();

        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();

        const address =
            document
                .getElementById("customerAddress")
                .value
                .trim();


        if (!name || !phone || !address) {

            checkoutStatus.textContent =
                "Please fill in all fields.";

            return;
        }


        if (cart.length === 0) {

            checkoutStatus.textContent =
                "Your cart is empty.";

            return;
        }


        if (!supabaseClient) {

            checkoutStatus.textContent =
                "Supabase is not connected. Add your URL and publishable key in script.js.";

            return;
        }


        checkoutStatus.textContent =
            "Sending order...";


        const orderId =
            crypto.randomUUID();


        const order = {

            id: orderId,

            customer_name: name,

            phone: phone,

            address: address,

            items: cart,

            total: totalCart(),

            status: "Pending"

        };


        console.log(
            "SENDING ORDER:",
            order
        );


        const { error } =
            await supabaseClient
                .from("orders")
                .insert(order);


        if (error) {

            console.error(
                "SUPABASE ORDER ERROR:",
                error
            );


            checkoutStatus.textContent =
                `ERROR: ${error.message}`;

            return;
        }


        checkoutForm.reset();

        cart = [];

        saveCart();

        renderCart();

        closeCheckout();

        document
            .getElementById("orderId")
            .textContent =
                orderId
                    .slice(0, 8)
                    .toUpperCase();


        document
            .getElementById("successModal")
            .classList.add("open");


        document.body.classList.add(
            "no-scroll"
        );

    }
);


/* =========================================================
   SUCCESS
========================================================= */

document
    .getElementById("closeSuccess")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("successModal")
                .classList.remove("open");

            document.body.classList.remove(
                "no-scroll"
            );

        }
    );


/* =========================================================
   CHATBOT
========================================================= */

const chatWindow =
    document.getElementById("chatWindow");

const chatMessages =
    document.getElementById("chatMessages");

const chatForm =
    document.getElementById("chatForm");

const chatInput =
    document.getElementById("chatInput");


document
    .getElementById("chatButton")
    .addEventListener(
        "click",
        function () {

            chatWindow.classList.toggle("open");

        }
    );


document
    .getElementById("closeChat")
    .addEventListener(
        "click",
        function () {

            chatWindow.classList.remove(
                "open"
            );

        }
    );


function addChat(text, type) {

    const message =
        document.createElement("div");

    message.className =
        `chat ${type}`;

    message.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


function botReply(text) {

    const message =
        text.toLowerCase();


    if (
        message.includes("burger")
    ) {
        return "Our Classic Chicken Burger is ₹149.";
    }


    if (
        message.includes("pizza")
    ) {
        return "Our Ember Loaded Pizza is ₹299.";
    }


    if (
        message.includes("pasta")
    ) {
        return "Our Creamy Alfredo Pasta is ₹249.";
    }


    if (
        message.includes("fries")
    ) {
        return "Our Loaded Fries are ₹129.";
    }


    if (
        message.includes("brownie")
    ) {
        return "Our Chocolate Brownie is ₹119.";
    }


    if (
        message.includes("hour") ||
        message.includes("timing") ||
        message.includes("open")
    ) {
        return "We're open daily from 11 AM to 11 PM.";
    }


    if (
        message.includes("location") ||
        message.includes("where")
    ) {
        return "We're in Bhopal, Madhya Pradesh.";
    }


    if (
        message.includes("order") ||
        message.includes("buy")
    ) {
        return "Add your food to the cart, then hit Checkout.";
    }


    return "I can help with menu items, prices, timings, location and ordering.";
}


chatForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const text =
            chatInput.value.trim();

        if (!text) {
            return;
        }

        addChat(text, "user");

        chatInput.value = "";


        setTimeout(
            function () {

                addChat(
                    botReply(text),
                    "bot"
                );

            },
            300
        );

    }
);


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const adminSection =
    document.getElementById("adminSection");

const loginForm =
    document.getElementById("loginForm");

const dashboard =
    document.getElementById("dashboard");

const logoutButton =
    document.getElementById("logoutButton");

const loginStatus =
    document.getElementById("loginStatus");

const ordersList =
    document.getElementById("ordersList");

const orderCount =
    document.getElementById("orderCount");


const urlParams =
    new URLSearchParams(
        window.location.search
    );


if (
    urlParams.get("admin") === "1"
) {

    adminSection.classList.add(
        "visible"
    );

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!supabaseClient) {

            loginStatus.textContent =
                "Supabase is not connected.";

            return;
        }


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        loginStatus.textContent =
            "Logging in...";


        const { error } =
            await supabaseClient.auth
                .signInWithPassword({
                    email,
                    password
                });


        if (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            loginStatus.textContent =
                `ERROR: ${error.message}`;

            return;
        }


        loginStatus.textContent = "";

        loginForm.classList.add(
            "hidden"
        );

        dashboard.classList.remove(
            "hidden"
        );

        logoutButton.classList.remove(
            "hidden"
        );


        await loadOrders();

    }
);


/* =========================================================
   GET ORDERS
========================================================= */

async function loadOrders() {

    if (!supabaseClient) {
        return;
    }


    const { data, error } =
        await supabaseClient
            .from("orders")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "LOAD ORDERS ERROR:",
            error
        );

        orderCount.textContent =
            error.message;

        return;
    }


    orderCount.textContent =
        `${data.length} order(s)`;


    renderOrders(data);

}


/* =========================================================
   SHOW ORDERS
========================================================= */

function renderOrders(orders) {

    if (orders.length === 0) {

        ordersList.innerHTML = `
            <div class="empty">
                No orders yet.
            </div>
        `;

        return;
    }


    ordersList.innerHTML =
        orders.map(order => {

            const items =
                Array.isArray(order.items)
                    ? order.items
                    : [];


            const itemHTML =
                items.map(item => `
                    <li>
                        ${item.quantity}
                        ×
                        ${escapeHTML(item.name)}
                    </li>
                `).join("");


            return `
                <article class="order-card">

                    <div class="order-card-top">

                        <div>

                            <strong>
                                ${escapeHTML(order.customer_name)}
                            </strong>

                            <div>
                                ${escapeHTML(order.phone)}
                            </div>

                            <div>
                                ${escapeHTML(order.address)}
                            </div>

                        </div>

                        <strong>
                            ${money(order.total)}
                        </strong>

                    </div>


                    <ul>
                        ${itemHTML}
                    </ul>


                    <div class="order-card-top">

                        <small>
                            ${new Date(
                                order.created_at
                            ).toLocaleString()}
                        </small>


                        <select
                            class="status-select"
                            onchange="
                                updateOrderStatus(
                                    '${order.id}',
                                    this.value
                                )
                            "
                        >

                            ${
                                [
                                    "Pending",
                                    "Preparing",
                                    "Ready",
                                    "Completed",
                                    "Cancelled"
                                ].map(status => `
                                    <option
                                        value="${status}"
                                        ${
                                            order.status === status
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        ${status}
                                    </option>
                                `).join("")
                            }

                        </select>

                    </div>

                </article>
            `;

        }).join("");
}


/* =========================================================
   UPDATE STATUS
========================================================= */

async function updateOrderStatus(
    orderId,
    status
) {

    if (!supabaseClient) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("orders")
            .update({
                status: status
            })
            .eq("id", orderId);


    if (error) {

        console.error(
            "STATUS ERROR:",
            error
        );

        alert(error.message);

        return;
    }


    await loadOrders();

}


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    async function () {

        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }

        dashboard.classList.add(
            "hidden"
        );

        logoutButton.classList.add(
            "hidden"
        );

        loginForm.classList.remove(
            "hidden"
        );

    }
);


/* =========================================================
   REFRESH
========================================================= */

document
    .getElementById("refreshOrders")
    .addEventListener(
        "click",
        loadOrders
    );


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   START
========================================================= */

renderMenu();
renderCart();
setInterval(() => {
    if (!document.getElementById("dashboard").classList.contains("hidden")) {
        loadOrders();
    }
}, 10000);