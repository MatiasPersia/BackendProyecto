const express = require('express');
const fs = require('fs');
const router = express.Router();

const cartsFilePath = './carrito.json';

// Leer carritos desde el archivo
const readCarts = () => {
  const data = fs.readFileSync(cartsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Escribir carritos en el archivo
const writeCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Ruta raíz POST / para crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
    products: []
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// Ruta GET /:cid para listar los productos de un carrito
router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cartId = parseInt(req.params.cid);
  const cart = carts.find(c => c.id === cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

// Ruta POST /:cid/product/:pid para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const cart = carts.find(c => c.id === cartId);
  if (cart) {
    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex !== -1) {
      // Si el producto ya existe en el carrito, incrementar la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si el producto no existe en el carrito, agregarlo con cantidad 1
      cart.products.push({ product: productId, quantity: 1 });
    }
    writeCarts(carts);
    res.json(cart);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

module.exports = router;
