const cart = [];
let cartCount = 0;

// Fetch products and render them
fetch('http://localhost:4000/products')
    .then(response => response.json())
    .then(products => {
        const productsDiv = document.getElementById('products');
        productsDiv.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="public/images/${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>$${(product.price / 100).toFixed(2)}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `).join('');
    });

// Add to cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    cartCount++;
    document.querySelector('.cart-btn').textContent = `Cart (${cartCount})`;
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}
