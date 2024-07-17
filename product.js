const Producturl = "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";
let allProducts = [];
let cart = [];
let wishlist = [];

async function renderProducts(category = null, searchQuery = '') {
    const section = document.querySelector(".Product");
    section.innerHTML = '';

    if (allProducts.length === 0) {
        const res = await fetch(Producturl);
        const product = await res.json();
        allProducts = product.categories;
    }

    const productsToRender = category
        ? allProducts.find(cat => cat.category_name === category)?.category_products || []
        : allProducts.flatMap(cat => cat.category_products);

    const filteredProducts = productsToRender.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(searchQuery);
        const brandMatch = product.vendor.toLowerCase().includes(searchQuery);
        const priceMatch = product.price.toString().includes(searchQuery);

        return titleMatch || brandMatch || priceMatch;
    });

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');

        productDiv.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>Price: $${product.price}</p>
            <p>Vendor: ${product.vendor}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="add-to-wishlist" data-id="${product.id}">Add to Wishlist</button>
        `;

        section.appendChild(productDiv);
    });

    // Add event listeners for the "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Add event listeners for the "Add to Wishlist" buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', addToWishlist);
    });
}

function filterItems(category) {
    const searchQuery = document.getElementById('search-bar').value;
    renderProducts(category, searchQuery);
}

document.getElementById('search-bar').addEventListener('input', () => {
    filterItems();
});

function addToCart(event) {
    const productId = event.target.dataset.id;
    const product = allProducts.flatMap(cat => cat.category_products).find(p => p.id == productId);

    if (product && !cart.includes(product)) {
        cart.push(product);
        renderCart();
    }
}

function addToWishlist(event) {
    const productId = event.target.dataset.id;
    const product = allProducts.flatMap(cat => cat.category_products).find(p => p.id == productId);

    if (product && !wishlist.includes(product)) {
        wishlist.push(product);
        renderWishlist();
    }
}

function renderCart() {
    const cartSection = document.querySelector(".Cart");
    cartSection.innerHTML = '';

    cart.forEach(product => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>Price: $${product.price}</p>
            <p>Vendor: ${product.vendor}</p>
            <button class="remove-from-cart" data-id="${product.id}">Remove from Cart</button>
        `;

        cartSection.appendChild(cartItemDiv);
    });

    // Add event listeners for the "Remove from Cart" buttons
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

function renderWishlist() {
    const wishlistSection = document.querySelector(".Wishlist");
    wishlistSection.innerHTML = '';

    wishlist.forEach(product => {
        const wishlistItemDiv = document.createElement('div');
        wishlistItemDiv.classList.add('wishlist-item');

        wishlistItemDiv.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}">
            <p>Price: $${product.price}</p>
            <p>Vendor: ${product.vendor}</p>
            <button class="remove-from-wishlist" data-id="${product.id}">Remove from Wishlist</button>
        `;

        wishlistSection.appendChild(wishlistItemDiv);
    });

    // Add event listeners for the "Remove from Wishlist" buttons
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', removeFromWishlist);
    });
}

function removeFromCart(event) {
    const productId = event.target.dataset.id;
    cart = cart.filter(product => product.id != productId);
    renderCart();
}

function removeFromWishlist(event) {
    const productId = event.target.dataset.id;
    wishlist = wishlist.filter(product => product.id != productId);
    renderWishlist();
}

renderProducts();
