const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.use((req, res, next) => {
    if(req.user) res.redirect('/');
    else next();
});

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
});

module.exports = router;