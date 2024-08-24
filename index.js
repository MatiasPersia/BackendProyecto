const express = require('express');
const app = express();
const port = 8080;

// Importar routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Middleware para parsear JSON
app.use(express.json());

// Configurar rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
