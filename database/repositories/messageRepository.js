const { UserModel, MessageModel } = require('../models');


const makeDateAsLocaleString = message => {
    let { creationDate } = message;
    creationDate = new Date(creationDate).toLocaleString();
    return { ...message, creationDate };
}
/**
 * 
 * @param {string} senderName 
 * @param {string} receiverName 
 * @param {string} subject 
 * @param {string} message 
 * @param {Date} creationDate 
 */

/// PUT RECEIVER NAME- IT'S SUPPOST TO BE ID, BUT IT'S EASY FOR YOUR TEST
const createMessage = async (sender, receiverName, subject, message, creationDate = new Date) => {
    let receiver = await UserModel.findOne({ fullName: receiverName }).exec();
    if (!receiver) return "Receiver not found";
    receiver = receiver._id

    console.log("receiverId", receiverId);
    let createdMessage = await new MessageModel({
        sender,
        receiver,
        subject,
        message,
        creationDate
    }).save();
    createdMessage = await createdMessage.populate("sender").populate("reciever").execPopulate();
    return makeDateAsLocaleString(createdMessage)
}
/**
 * 
 * @param {number} userId 
 */

// Assume the sent message& recieved messages
const getAllMessagesSpecificUser = async userId => {
    let messages = await MessageModel.find({ $or: [{ sender: userId }, { receiver: userId }] }).
        populate("sender", "fullName").populate("receiver", "fullName").exec();
    messages = messages.map(message => makeDateAsLocaleString(message));
    return messages;
}
/**
 * 
 * @param {number} userId 
 */

// Assume the  recieved messages
const getAllUnreadMessagesSpecificUser = async userId => {
    let messages = await MessageModel.find({ receiver: userId, isRead: false }).
        populate("sender", "fullName").populate("receiver", "fullName").exec();
    messages = messages.map(message => makeDateAsLocaleString(message));
    return messages;
}

const readMessage = async (_id, receiverId) => {
    let message = await MessageModel.findById(_id).populate("sender", "fullName").populate("receiver", "fullName").exec();
    if (!message) return "Message not found";
    if (message.receiverId !== receiverId) return "You're not allowed to read message, only reciever user";
    message.isRead = true;
    await message.save();
    return makeDateAsLocaleString(message);
}

const deleteMessage = async (_id, userId) => {
    return await MessageModel.findOne({ _id, $or: [{ receiver: userId }, { sender: userId }] }).remove().exec();
}


module.exports = {
    createMessage,
    getAllMessagesSpecificUser,
    getAllUnreadMessagesSpecificUser,
    readMessage,
    deleteMessage
}