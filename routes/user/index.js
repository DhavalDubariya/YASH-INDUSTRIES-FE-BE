const express = require("express");
const router = express.Router();
const userController = require("./user.controller.js");
// const middleware = require("../../middleware");


router.get("/login",userController.loginController);

module.exports = router