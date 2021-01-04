const mongoose = require('mongoose');
const { Types } = mongoose.Schema

const MessageSchema = new mongoose.Schema({
    sender: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    isRead: {
        type: Types.Boolean,
        required: true,
        default: false
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Types.Date,
        required: true,
        default: new Date()
    }
})

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;