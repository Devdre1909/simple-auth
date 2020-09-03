const express = require("express");
const chalk = require("chalk");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const morgan = require("morgan");
const httpStatusCode = require("http-status-codes");
const response = require("../utils/response");

const connectDB = require("../config/connectDB");

module.exports = () => {
  let server = express();
  let create;
  let start;

  create = () => {
    // Routes
    const indexRouter = require("../routes");

    dotenv.config({
      path: `${path.join(__dirname, "../.env.local")}`,
    });

    //set all server parameters
    server.set("env", process.env.NODE_ENV);
    server.set("port", process.env.PORT);
    server.set("hostname", process.env.HOSTNAME);

    // add middleware
    server.use(helmet());
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));

    //connect db
    connectDB();

    if (server.get("env") === "dev") {
      server.use(morgan("tiny"));
    }

    server.use(mongoSanitize());
    server.use(xss());
    server.use(hpp());

    //set up routes
    server.use("/api", indexRouter);

    // 404 Error Handler. Request not found.
    server.use((req, res, next) => {
      return response(
        req,
        res,
        "error",
        "Not found",
        null,
        httpStatusCode.BAD_REQUEST
      );
    });

    if (process.env.NODE_ENV === "production") {
      // Do not send stack trace of error message when in production
      // eslint-disable-next-line no-unused-vars
      server.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send("Error occurred while handling the request.");
      });
    } else {
      // Log stack trace of error message while in development
      // eslint-disable-next-line no-unused-vars
      server.use((err, req, res, next) => {
        res.status(err.statusCode || 500);
        console.log(err);
        response(
          req,
          res,
          "error",
          err.message,
          null,
          httpStatusCode.INTERNAL_SERVER_ERROR
        );
      });
    }

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      console.log(chalk.red(`Error: ${err.message}`));
    });
  };

  start = () => {
    let hostname = server.get("hostname");
    let port = server.get("port") || 5000;
    server.listen(server.get("port"), () => {
      console.log(
        chalk.yellow.bold(`Express server listening on - ${hostname}:${port}`)
      );
    });
  };

  return {
    create,
    start,
  };
};
