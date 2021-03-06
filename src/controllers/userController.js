const { UserRepository } = require('../../database');
const { StatusCodes } = require('http-status-codes');
const hasInternalError = require('../others/hasInternalError');


const signup = async (req, res) => {
    try {
        const result = await UserRepository.createUser(req.body);
        if (result === "exists") return res.status(StatusCodes.CONFLICT).send("Full Name is unique, please type other full name");
        const { token, user } = result;
        res.setHeader("Authorization", token);
        res.send(`Succeed to signup a ${user.fullName}`);
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

const signin = async (req, res) => {
    try {
        const result = await UserRepository.signInUser(req.body);
        if (result === "User not found") return res.status(StatusCodes.NOT_FOUND).send(result);
        if (result === "Password incorrect") return res.status(StatusCodes.CONFLICT).send(result);
        const { token, user } = result;
        res.setHeader("Authorization", token);
        res.status(StatusCodes.OK).send(`Succeed to signin ${user.fullName}`);
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

module.exports = {
    signin,
    signup
}