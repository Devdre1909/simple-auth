/**
 *
 * Send response to client
 *
 * @param {object} req
 * @param {object} res
 * @param {string} type
 * @param {string} msg
 * @param {*} data
 * @param {number} status
 */

const response = async (req, res, type, msg, data, status) => {
  return res.status(status).json({
    success: type == "success",
    message: msg,
    data: data == null ? "" : data,
  });
};

module.exports = response;
