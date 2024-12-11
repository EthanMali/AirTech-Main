const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Add CORS support
const app = express();
const port = 4000;

// Setup multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Make filenames unique
  },
});
const upload = multer({ storage });

// Dummy database to hold products (use a real DB in production)
const products = [];

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json
app.use(express.static('uploads')); // Serve static files like images from the uploads folder
app.use(express.static('public')); // Serve static files from the 'public' directory

// Route to get all products
app.get('/api/products', (req, res) => {
  console.log('Sending all products:', products);
  res.json(products); // Return the list of products
});

// Route to add a new product
app.post('/api/products', upload.single('image'), (req, res) => {
  console.log('Received data:', req.body);
  console.log('Received file:', req.file);

  const { name, price, stock } = req.body;
  const image = req.file ? req.file.filename : null; // Get the image filename from the upload

  if (!name || !price || !stock || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newProduct = {
    id: Date.now(), // Generate a unique id for the product
    name,
    price,
    stock,
    image, // Store the filename of the uploaded image
  };
  products.push(newProduct); // Add product to the array (replace with DB logic)
  
  console.log('New product added:', newProduct);
  res.status(201).json(newProduct); // Respond with the created product
});

// Route to delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params; // Get the product ID from the URL

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

// Serve a static HTML file for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Replace 'index.html' with your actual HTML file
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
