const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatusCodes = require("http-status-codes");
const chalk = require("chalk");

const { validationResult } = require("express-validator");

const User = require("../../../models/user");
const response = require("../../../utils/response");

server = express();
server.set("port", process.env.PORT);
server.set("hostname", process.env.HOSTNAME);

/**
 *
 * Register user
 *
 * @route /api/v1/auth/register
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const register = async (req, res, next) => {
  let e = isErrors(req);

  if (!e.e) return resToBodyError(req, res, e.errors);

  let { name, email, password } = req.body;

  let isEmailExists = await User.findOne({
    email,
  });

  if (isEmailExists)
    return response(
      req,
      res,
      "error",
      "email already in use",
      null,
      httpStatusCodes.CONFLICT
    );

  let hashedPassword = await bcrypt.hash(password, 8);

  try {
    let user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) throw new error();

    return response(
      req,
      res,
      "success",
      "user registration successful",
      null,
      httpStatusCodes.CREATED
    );
  } catch (error) {
    console.log(chalk.red(error));
    return response(
      req,
      res,
      "error",
      "there was a problem registering user",
      null,
      httpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const login = async (req, res, next) => {
  let e = isErrors(req);

  if (!e.e) return resToBodyError(req, res, e.errors);

  let { email, password } = req.body;

  try {
    let isUserExist = await User.findOne({
      email,
    });

    if (!isUserExist)
      return response(
        req,
        res,
        "error",
        "invalid email/password",
        null,
        httpStatusCodes.UNAUTHORIZED
      );

    let isPasswordValid = await bcrypt.compare(password, isUserExist.password);

    if (!isUserExist || !isPasswordValid)
      response(
        req,
        res,
        "error",
        "invalid email/password",
        null,
        httpStatusCodes.UNAUTHORIZED
      );

    let token = generateToken(isUserExist._id);

    return response(
      req,
      res,
      "success",
      "login successful",
      { token },
      httpStatusCodes.OK
    );
  } catch (error) {
    console.log(chalk.red(error));
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: [
        {
          msg: "there was a problem login user in",
          error,
        },
      ],
    });
  }
};

/**
 *
 * Return jwt token
 * @param {string} id
 */
const generateToken = (id) => {
  let token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

/**
 * Check if errors in body
 * @param {Object} req
 */

const isErrors = (req) => {
  const errors = validationResult(req);
  return { e: errors.isEmpty(), errors };
};

/**
 * Send response if error in body
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} errors
 */

const resToBodyError = (req, res, errors) => {
  return response(
    req,
    res,
    "error",
    "invalid credentials",
    errors.array().map((e) => e.msg),
    httpStatusCodes.UNPROCESSABLE_ENTITY
  );
};

module.exports = {
  register,
  login,
};
