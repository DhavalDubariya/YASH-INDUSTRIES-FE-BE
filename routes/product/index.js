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

router.get("/genric-machine",middleware.checkAccessToken,productController.genricMachineController)
router.get("/worker",middleware.checkAccessToken,productController.getWorkerController)

router.get("/machine-report",middleware.checkAccessToken,productController.machineReportController)
router.post("/machine-report",middleware.checkAccessToken,productController.createMachineReportController)
router.get("/machine-time",middleware.checkAccessToken,productController.getTimeController)

router.post("/machine-data",middleware.checkAccessToken,productController.getMachineDataController)

router.post("/dispatch-order",middleware.checkAccessToken,productController.dispatchOrderController)
router.get("/dispatch-order",productController.getdispatchOrderController)

router.get("/daily-machine-report",productController.getDailyMachineReportController)
router.post("/rejection-count",middleware.checkAccessToken,productController.rejectionCountController)

router.post("/stock-tack",middleware.checkAccessToken,productController.stockTackController)

router.delete("/dispatch-order",middleware.checkAccessToken,productController.deleteDispatchOrderController)

module.exports = router