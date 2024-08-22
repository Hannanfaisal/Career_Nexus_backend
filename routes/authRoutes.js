const express = require("express");
const authContoller = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post('/register', authContoller.register)
authRouter.post('/login', authContoller.login)

authRouter.post('/logout', authContoller.logout)

module.exports = authRouter;