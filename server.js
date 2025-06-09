//llamo express
const express = require('express');
const server = express();
const cors = require('cors')
const PORT = process.env.PORT || 3010;//puerto por defecto generalmente para el localhost
/**
 * Para añadir:
 * Uso de multer para controlar la subida de imagenes
 * Pensar bien en el verify, actualmente se tiene realizado el mail, hay que pasar en el link del correo electronico un token con el email encriptado diria
 * Asi nadie puede simplemente poner /verify con el email en el localhost y que se pase por la chota el email.
 * 
 */

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