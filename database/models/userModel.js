const mongoose = require('mongoose');
require('../dbConnection');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
})
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;