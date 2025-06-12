const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validateToken = require("../middlewares/validateToken");
const { sendMail } = require("../middlewares/sendMail");

//gets
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);

//posts
router.post("/create", userController.createNewUser);
router.post("/login", userController.logIn);
router.post("/sendMail", async (req,res) => { 
  try {
    await sendMail(req.body.email);
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
});

//put
router.put("/update/:id", [validateToken], userController.updateUserById);
router.put("/verifyUser", [validateToken], userController.verifyUser);

//deletes
router.delete("/remove/:id", [validateToken], userController.removeUserById);

module.exports = router;
