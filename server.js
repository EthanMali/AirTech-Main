const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 4000;

// Create 'uploads' directory if it doesn't exist
const uploadsDir = 'https://ethanmali.github.io/AirTech-Main/uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Setup multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      console.log('Uploading file:', file); // Log the file object
      cb(null, Date.now() + path.extname(file.originalname)); // Ensure this creates a unique filename
    },
  });
  

const upload = multer({ storage });

// Dummy product data (replace with a real database in production)
let products = []; // Initialize the products array

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json (if needed for other fields, like in APIs)
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
    console.log('File uploaded:', req.file); // Log the file object to check
    const { name, price, stock, description } = req.body;
    const image = req.file;
  
    // Validate that all required fields are provided
    if (!name || !price || !stock || !description || !image) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const newProduct = {
      id: Date.now(),
      name,
      price,
      stock,
      description,
      imageUrl: `AirTech-Main/public/images/${image.filename}`
    };
  
    products.push(newProduct);
  
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
            <img src="${product.imageUrl}" alt="${product.name}"> <!-- Updated path -->
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
