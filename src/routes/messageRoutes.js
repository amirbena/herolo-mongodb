const router = require('express').Router();
const MessageController = require('../controllers/messageController');
const authentication = require('../middlewares/authentication');



router.post('/', authentication, MessageController.sendMessage);
router.get('/all', authentication, MessageController.getAllMessagesForLoggedUser);
router.get('/unread', authentication, MessageController.getAllUnreadMessagesForLoggedUser);
router.put('/:id/read',authentication ,MessageController.readMessage);
router.delete('/:id',authentication ,MessageController.deleteMessage);


module.exports = router;
