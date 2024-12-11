window.addEventListener('load', () => {
    const path = window.location.pathname;
    const productId = path.split('/').pop(); // Extract the product ID from the URL

    if (productId) {
        // Fetch the product data and display it
        fetch(`/AirTech-Main/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-image').src = `/AirTech-Main/uploads/${product.imageUrl}`;
                document.getElementById('product-description').textContent = product.description;
                // Set other product details like price, stock, etc.
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }
});
