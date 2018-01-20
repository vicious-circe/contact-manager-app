const express = require('express');
const router = express.Router();

var isLoggedIn = (req, res, next) => {

}

router.get('/home', (req, res) => {
    res.send('home page for user');
});

module.exports = router;