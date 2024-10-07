const express = require('express');
const mongoose = require('mongoose');
const { create } = require('express-handlebars');
const productsRouter = require('./routes/products'); // Asegúrate de que la ruta sea correcta
const cartsRouter = require('./routes/carts'); // Asegúrate de que la ruta sea correcta

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Configuración de Handlebars
const hbs = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    // Agrega tus helpers aquí si es necesario
});

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './views');

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
