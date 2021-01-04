const router = require('express').Router();
const UserController = require('../controllers/userController');



router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);


module.exports = router;
