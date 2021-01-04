const { StatusCodes } = require('http-status-codes');

module.exports = (res,error) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Internal Error: ${error.message}`);
}