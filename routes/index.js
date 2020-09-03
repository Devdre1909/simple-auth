const express = require("express");

const router = express.Router();

// Continue to v1
const v1ApiController = require("./apis/index");
router.use("/v1", v1ApiController);

module.exports = router;
