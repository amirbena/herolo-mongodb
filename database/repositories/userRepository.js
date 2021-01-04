const { UserModel, MessageModel } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const genToken = async ({ _id, fullName }) => {
    const tokenPayload = { _id, fullName };
    const token = await jwt.sign(tokenPayload, process.env.TOKEN_KEY);
    return token;
}
/**
 * 
 * @param {string} fullName- 
 * @param {string} password- 
 */
const createUser = async ({ fullName, password: plainPassword }) => {
    const existedUser = await UserModel.findOne({ fullName }).exec();
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(plainPassword, salt);
    if (existedUser) return "User is exists";
    const user = await new UserModel({
        fullName,
        password
    }).save();
    console.log(user);
    const token = await genToken(user);
    return { token, user };
}
/**
 * 
 * @param {string} fullName 
 */
const getUserByName = async (fullName) => {
    const user = await UserModel.findOne({ fullName }).exec();
    return user;
}


const signInUser = async ({ fullName, password }) => {
    const user = await UserModel.findOne({ fullName }).exec();
    if (!user) return "User not found";
    const equalPassword = await bcrypt.compare(user.password, password);
    if (!equalPassword) return "Password incorrect";
    const token = await genToken(user);
    return { token, user };
}

module.exports = {
    createUser,
    getUserByName,
    signInUser

}