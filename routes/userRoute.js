const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateToken = require("../middlewares/validateToken");
const { sendMail } = require("../config/mailer");

//gets
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/sendMail', sendMail);//para el reenviar mensaje.

//posts
router.post('/create', userController.createNewUser);
router.post('/login', userController.logIn);

//put
router.put('/update/:id',[validateToken],userController.updateUserById);


//deletes
router.delete('/remove/:id',[validateToken], userController.removeUserById);

module.exports = router;