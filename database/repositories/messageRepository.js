const { UserModel, MessageModel } = require('../models');


const makeDateAsLocaleString = message => {
    let { creationDate } = message;
    creationDate = new Date(creationDate).toLocaleString();
    return { ...message, creationDate };
}


const manipulateUserAttributesAtMessage = pureMessage => {
    const newMessage = pureMessage;
    newMessage.sender = newMessage.sender.fullName;
    newMessage.receiver = newMessage.receiver.fullName;
    delete newMessage.__v;
    return newMessage;
}
const manipulatePopulatedMessage = message => {
    const pureMessage = manipulateUserAttributesAtMessage(message._doc);
    return makeDateAsLocaleString(pureMessage);
}
/// PUT RECEIVER NAME- IT'S SUPPOST TO BE ID, BUT IT'S EASY FOR YOUR TEST
/**
 * 
 * @param {string} senderName 
 * @param {string} receiverName 
 * @param {string} subject 
 * @param {string} message 
 * @param {Date} creationDate 
 */
const createMessage = async (sender, receiverName, subject, message, creationDate = new Date) => {
    let receiver = await UserModel.findOne({ fullName: receiverName }).exec();
    if (!receiver) return "Receiver not found";
    receiver = receiver._id

    let createdMessage = await new MessageModel({
        sender,
        receiver,
        subject,
        message,
        creationDate
    }).save();
    createdMessage = await createdMessage.populate("sender").populate("receiver").execPopulate();
    return manipulatePopulatedMessage(createdMessage);
}
/**
 * 
 * @param {number} userId 
 */

// Assume the sent message& recieved messages
const getAllMessagesSpecificUser = async userId => {
    let messages = await MessageModel.find({ $or: [{ sender: userId }, { receiver: userId }] }).
        populate("sender").populate("receiver").exec();
    messages = messages.map(message => manipulatePopulatedMessage(message));
    return messages;
}
/**
 * 
 * @param {number} userId 
 */

// Assume the  recieved messages
const getAllUnreadMessagesSpecificUser = async userId => {
    let messages = await MessageModel.find({ receiver: userId, isRead: false }).
        populate("sender").populate("receiver").exec();
    messages = messages.map(message => manipulatePopulatedMessage(message));
    return messages;
}

const readMessage = async (id, receiverId) => {
    let message = await MessageModel.findById(id).populate("sender").populate("receiver").exec();
    if (!message) return "Message not found";

    if (String(message.receiver._id) !== receiverId) return "You're not allowed to read message, only receiver user";
    message.isRead = true;
    await message.save();
    return manipulatePopulatedMessage(message);
}

const deleteMessage = async (_id, userId) => {
    return await MessageModel.deleteOne({ _id, $or: [{ receiver: userId }, { sender: userId }] }).exec();
}


module.exports = {
    createMessage,
    getAllMessagesSpecificUser,
    getAllUnreadMessagesSpecificUser,
    readMessage,
    deleteMessage
}