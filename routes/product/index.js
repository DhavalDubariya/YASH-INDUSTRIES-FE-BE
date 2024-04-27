const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const middleware = require("../middleware");

router.post("/product",middleware.checkAccessToken,productController.createproductController);
router.get("/order-list",middleware.checkAccessToken,productController.getOrderListController);
router.get("/product-detail", middleware.checkAccessToken, productController.getProductModule);
router.put("/product", middleware.checkAccessToken, productController.addProductModule);

module.exports = router