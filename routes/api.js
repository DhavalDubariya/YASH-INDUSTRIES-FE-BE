var express = require('express');
var router = express.Router();

/* API CONTROLLER. */
router.use("/user", require("./user"));
router.use("/customer", require("./customer"));
router.use("/product", require("./product"));

module.exports = router;
