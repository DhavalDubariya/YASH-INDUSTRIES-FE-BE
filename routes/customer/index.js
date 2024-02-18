const express = require("express");
const router = express.Router();
const customerController = require("./customer.controller.js");
const middleware = require("../middleware");


router.post("/customer",middleware.checkAccessToken,customerController.createCustomerController);
router.get("/customer",middleware.checkAccessToken,customerController.getCustomerController);
router.get("/customer-detail",middleware.checkAccessToken,customerController.getCustomerDetailController);
router.put("/customer",middleware.checkAccessToken,customerController.updateCustomerController);

module.exports = router