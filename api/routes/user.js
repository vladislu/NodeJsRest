const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update/:userId', checkAuth , userController.update);

module.exports = router;