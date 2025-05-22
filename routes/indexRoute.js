const express = require("express");
const indexRouter = express.Router();
const userRouter = require('./userRoute')
//En este archivo van todas las rutas principales:

//ruta por defecto
indexRouter.get('/', (req, res) => {
    res.send("Hola Mundo");
});


indexRouter.use("/users", userRouter);

module.exports = indexRouter;