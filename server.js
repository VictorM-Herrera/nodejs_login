//llamo express
const express = require('express');
const server = express();
const cors = require('cors')
const PORT = process.env.PORT || 3010;//puerto por defecto generalmente para el localhost

// Middlewares
server.use(express.json());// Permite recibir datos en formato JSON
server.use(express.urlencoded({ extended : true})); // permite recibir datos complejos
server.use(cors());//para poder usar la app en otros dominios.
//Rutas
const indexRoutes = require("./routes/indexRoute.js");
server.use(indexRoutes);

// iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})