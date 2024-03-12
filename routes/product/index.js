const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const middleware = require("../middleware");

router.post("/product",middleware.checkAccessToken,productController.createproductController);
router.get("/product",middleware.checkAccessToken,productController.getProductModuleList);
router.get("/product-detail", middleware.checkAccessToken, productController.getProductModule);

module.exports = router