const { UserModel } = require('../models');
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
const createUser = async ({ fullName, password }) => {
    const existedUser = await UserModel.findOne({ fullName }).exec();
    if (existedUser) return "exists";
    const user = await new UserModel({
        fullName,
        password
    }).save();
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
    if (user.password!== password) return "Password incorrect";
    const token = await genToken(user);
    return { token, user };
}

module.exports = {
    createUser,
    getUserByName,
    signInUser

}