const { UserRepository } = require('../../database');
const { StatusCodes } = require('http-status-codes');
const hasInternalError = require('../others/hasInternalError');


const signup = async (req, res) => {
    try {
        const result = await UserRepository.createUser(req.body);
        if (result === "User is Exists") return res.status(StatusCodes.CONFLICT).send(result);
        const { token, user } = result;
        res.setHeader("authorization", token);
        res.send(`Succeed to signup a user`);
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
        res.setHeader("authorization", token);
        res.status(StatusCodes.OK).send(`Succeed to signin ${user.fullName}`);
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

module.exports = {
    signin,
    signup
}