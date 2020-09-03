const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let Schema = mongoose.Schema;

let User = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    resetPasswordToken: {
      type: String,
    },
    restPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model("User", User);
