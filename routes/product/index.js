const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const middleware = require("../middleware");

router.post("/product",middleware.checkAccessToken,productController.createproductController);

module.exports = router