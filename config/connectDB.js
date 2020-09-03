const mongoose = require("mongoose");
const chalk = require("chalk");

/**
 * Connects to mongo db
 */

const connectDB = async () => {
  let c;
  if (process.env.NODE_ENV == "production") {
    c = process.env.MONGO_URL_PROD;
  } else {
    c = process.env.MONGO_URL;
  }
  try {
    const connect = await mongoose.connect(c, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(
      chalk.black.bgYellow(
        `MongoDB connected: ${chalk.bgYellow.bold(
          connect.connection.host
        )} @ ${new Date().toString()}`
      )
    );
  } catch (err) {
    console.log(chalk.red(err.message));
  }
};

module.exports = connectDB;
