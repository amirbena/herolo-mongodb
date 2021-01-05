
const { MessageRepository } = require('../../database');
const { StatusCodes } = require('http-status-codes');
const hasInternalError = require('../others/hasInternalError');


///ALL REQUESTS IN THIS MODULE ARE AUTHENTICATED (LOG IN & TAKE TOKEN FROM RESPONSE.AUTHORIZATION AND PUT IT AS BEARER TOKEN)


const sendMessage = async (req, res) => {
    const { _id: senderId } = req.user;
    try {
        const { receiverName, subject, message } = req.body;
        const createdMessage = await MessageRepository.createMessage(senderId, receiverName, subject, message, new Date());
        if (createdMessage === "Receiver not found") res.status(StatusCodes.NOT_FOUND).send(message);
        return res.json({ message: createdMessage, result: "Message has sent to reciever" });
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}


const getAllMessagesForLoggedUser = async (req, res) => {
    const { _id: userId } = req.user;
    try {
        const messages = await MessageRepository.getAllMessagesSpecificUser(userId);
        return res.json({ messages });
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}


const getAllUnreadMessagesForLoggedUser = async (req, res) => {
    const { _id: userId } = req.user;
    try {
        const unreadMessages = await MessageRepository.getAllUnreadMessagesSpecificUser(userId);
        return res.json({ unreadMessages });
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}


const readMessage = async (req, res) => {
    const { id } = req.params;
    const { _id: receiverId } = req.user;
    try {
        const message = await MessageRepository.readMessage(id, receiverId);
        if (message === "Message not found") return res.status(StatusCodes.NOT_FOUND).send(message);
        if (message === "You're not allowed to read message, only receiver user") return res.status(StatusCodes.FORBIDDEN).send(message);
        return res.json({ message });
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user;
    try {
        const result = await MessageRepository.deleteMessage(id, userId);
        if (!result.n) return res.status(StatusCodes.NOT_FOUND).send("Message not found between user conversations");  // n means how much rows effected 
        return res.send("Deleted Message");
    } catch (ex) {
        return hasInternalError(res, ex)
    }
}

module.exports = {
    sendMessage,
    getAllMessagesForLoggedUser,
    readMessage,
    deleteMessage,
    getAllUnreadMessagesForLoggedUser
}