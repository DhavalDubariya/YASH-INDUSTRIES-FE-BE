const express = require("express");
const router = express.Router();
const userController = require("./user.controller.js");
const middleware = require("../middleware.js");


router.post("/login",userController.loginController);
router.get("/me",middleware.checkAccessToken,userController.getUserDetailController);

module.exports = router