const express = require("express");
let router = express.Router();

const authService = require("../../../services/v1/auth/auth");
const validation = require("../../../middlewares/validation");

router.post(
  "/register",
  validation.validateRegistrationBody(),
  authService.register
);
router.post("/login", validation.validateLoginBody(), authService.login);

module.exports = router;
