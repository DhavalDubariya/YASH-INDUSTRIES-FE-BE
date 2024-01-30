const express = require("express");
const router = express.Router();
const customerController = require("./customer.controller.js");
// const middleware = require("../../middleware");


router.post("/customer",customerController.createCustomerController);

module.exports = router