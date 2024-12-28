const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', userController.signup);

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/logout', (req, res) => {
    // Clear session or authentication data here if applicable
    res.redirect('/');
});

router.post('/login', userController.login);

router.get('/transition', userController.getUserByUPI);

module.exports = router;