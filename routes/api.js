var express = require('express');
var router = express.Router();

/* API CONTROLLER. */
router.use("/user", require("./user"));
router.use("/customer", require("./customer"));

module.exports = router;
