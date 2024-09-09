const express = require('express');
const { create } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs'); // Importar fs para leer archivos
const app = express();
const port = 8080;

// Configurar Handlebars
const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './views');

// Crear servidor HTTP y configurar socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Importar routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Middleware para parsear JSON
app.use(express.json());

// Definir función readProducts
const productsFilePath = './productos.json';
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Configurar rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista home
app.get('/', (req, res) => {
  const products = readProducts();
  res.render('home', { products });
});

// Ruta para la vista realTimeProducts
app.get('/realtimeproducts', (req, res) => {
  const products = readProducts();
  res.render('realTimeProducts', { products });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Configurar socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('addProduct', (product) => {
    const products = readProducts();
    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      ...product,
      status: true
    };
    products.push(newProduct);
    writeProducts(products);
  });

  socket.on('deleteProduct', (productId) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(productId));
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      writeProducts(products);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Definir función writeProducts
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  io.emit('updateProducts', products); // Emitir evento de actualización
};

module.exports = { io };
