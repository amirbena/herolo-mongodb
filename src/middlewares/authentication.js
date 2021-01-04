const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken');


const authentication = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) return res.status(StatusCodes.BAD_REQUEST).send("No input come");
    const verifiedToken = jwt.decode(token);
    req.user = verifiedToken;
    next();
}

module.exports = authentication;