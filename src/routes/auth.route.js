let express = require('express');
let router = express.Router();
let passport = require('passport');
let GoogleStrategy = require('passport-google-oidc');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const FederatedCredentails = require('../models/federatedCredentials.model')

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile']
}, function verify(issuer, profile, cb) {
    FederatedCredentails.findOne({ provider: issuer, subject: profile.id }, async function (err, doc) {
        if (err) { return cb(err); }
        if (!doc) {
            await User.create({ name: profile.displayName }, async function (err) {
                if (err) { return cb(err); }

                var id = this.lastID;
                await FederatedCredentails.create({ userId: id, provider: issuer, subject: profile.id }, function (err) {
                    if (err) { return cb(err); }
                    var user = {
                        id: id,
                        name: profile.displayName
                    };
                    return cb(null, user);
                });
            });
        } else {
            User.findOne({ id: doc.user_id }, function (err, doc) {
                if (err) { return cb(err); }
                if (!doc) { return cb(null, false); }
                return cb(null, doc);
            });
        }
    });
}));

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;