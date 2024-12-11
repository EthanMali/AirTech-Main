const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 4000;



// Setup multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames based on the current timestamp
  },
});

const upload = multer({ storage });

// Dummy product data (replace with a real database in production)
const products = [
    { id: 1, name: 'AirPod Pro', price: 249, stock: 100, description: 'Premium wireless earphones', image: 'airpod.jpg' }
  ];
  
// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json
app.use(express.static('uploads')); // Serve static files (images, etc.) from the 'uploads' folder

// Route to get all products
app.get('/api/products', (req, res) => {
    console.log('Sending all products:', products);
    res.json(products); // Return the list of products
});

// Route to get product by ID for details page
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Route to add a new product
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, price, stock, description } = req.body;
    const image = req.file;

    // Validate that all required fields are provided
    if (!name || !price || !stock || !description || !image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Here you would save the product data to your database
    // For now, we simulate the saving process
    const newProduct = {
        id: Date.now(),
        name,
        price,
        stock,
        description, // Include description
        imageUrl: `/uploads/${image.filename}` // Assuming image is saved in the 'uploads' folder
    };

    // Respond with the new product data
    res.status(200).json(newProduct);
});




// Route to delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    // Find the product by ID
    const productIndex = products.findIndex(product => product.id == id);

    if (productIndex === -1) {
        console.log('Product not found:', id);
        return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from the array
    const deletedProduct = products.splice(productIndex, 1);
    console.log('Deleted product:', deletedProduct);

    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
});

// Route to serve static HTML file for the root path (Home page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve your main homepage
});

// Route to serve product pages dynamically
app.get('/product/:id', (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
        return res.status(404).send('Product not found');
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${product.name}</title>
            <link rel="stylesheet" href="public/css/style.css">
        </head>
        <body>
            <h1>${product.name}</h1>
            <img src="uploads/${product.image}" alt="${product.name}">
            <p>Price: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>${product.description}</p>
        </body>
        </html>
    `);
});

// Serve static files (e.g., CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


app.get('/api/products', (req, res) => {
  // Assuming you have a product model
  Product.find().then(products => {
      // Ensure 'condition' exists in the response
      products.forEach(product => {
          product.condition = product.condition || "Condition not specified";  // Default fallback
      });
      res.json(products);
  });
});


