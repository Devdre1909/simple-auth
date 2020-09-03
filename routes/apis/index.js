const express = require("express");

const router = express.Router();

const authController = require("../../controllers/apis/v1/auth");
router.use("/auth", authController);

module.exports = router;
