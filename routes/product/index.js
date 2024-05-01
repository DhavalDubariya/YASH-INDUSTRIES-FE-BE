const express = require("express");
const router = express.Router();
const productController = require("./product.controller");
const middleware = require("../middleware");

router.post("/product",middleware.checkAccessToken,productController.createproductController);
router.get("/order-list",middleware.checkAccessToken,productController.getOrderListController);
router.get("/product-detail", middleware.checkAccessToken, productController.getProductModule);
router.put("/product", middleware.checkAccessToken, productController.updateProductController);

router.get("/order-detail",middleware.checkAccessToken, productController.orderDetailController)

router.get("/customer-order", productController.getCustomerOrderController)
router.post("/dayily-product",middleware.checkAccessToken,productController.createDailyProductController)
router.get("/dayily-product",middleware.checkAccessToken,productController.getDailyProductController)

module.exports = router