const express = require('express');
const fs = require('fs');
const router = express.Router();

const productsFilePath = './productos.json';

// Leer productos desde el archivo
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Escribir productos en el archivo
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Ruta raíz GET / para listar todos los productos
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Ruta GET /:pid para obtener un producto por ID
router.get('/:pid', (req, res) => {
  const products = readProducts();
  const productId = parseInt(req.params.pid);
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta raíz POST / para agregar un nuevo producto
router.post('/', (req, res) => {
  const products = readProducts();
  const { title, description, code, price, stock, category } = req.body;
  const newProduct = {
    id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
    title,
    description,
    code,
    price,
    status: true, // Status por defecto es true
    stock,
    category
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// Ruta PUT /:pid para actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const products = readProducts();
  const productId = parseInt(req.params.pid);
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...req.body, id: productId };
    products[productIndex] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Ruta DELETE /:pid para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const products = readProducts();
  const productId = parseInt(req.params.pid);
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    writeProducts(products);
    res.status(204).send();
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

module.exports = router;
