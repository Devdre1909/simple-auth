const { check, body } = require("express-validator");

// validate req body when registering
const validateRegistrationBody = () => {
  return [
    check("fullName")
      .exists()
      .withMessage("full name is required")
      .notEmpty()
      .withMessage("full name cannot be empty")
      .isLength({
        min: 3,
      })
      .withMessage("full name must be greater that 3 letters")
      .trim()
      .escape(),
    check("email")
      .exists()
      .withMessage("email is required")
      .notEmpty()
      .withMessage("email cannot be empty")
      .isEmail()
      .withMessage("email is invalid")
      .trim(),
    check("password")
      .exists()
      .withMessage("password is required")
      .notEmpty()
      .withMessage("password cannot be empty")
      .isLength({
        min: 6,
      })
      .withMessage("password must be above 6 charters long"),
  ];
};

// validate login body
const validateLoginBody = () => {
  return [
    check("email")
      .exists()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid")
      .trim(),
    check("password")
      .exists()
      .withMessage("password is required")
      .isLength({
        min: 6,
      })
      .withMessage("invalid email/password"),
  ];
};

module.exports = {
  validateLoginBody,
  validateRegistrationBody,
};
