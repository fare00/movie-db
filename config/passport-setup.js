const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.log(err);
        });
});

passport.use(
    new GoogleStrategy({
        callbackURL: `https://mov-db.herokuapp.com/auth/redirect`,
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {

        User.findOne({googleID: profile.id})
            .then(currentuser => {
                if(currentuser){
                    done(null, currentuser);
                }else{
                    new User({
                        username: profile.displayName,
                        googleID: profile.id,
                        picture: profile._json.picture,
                        email: profile._json.email,
                        role: 1,
                        rated: [],
                        watchlist: []
                    }).save()
                        .then(newuser => {
                            done(null, newuser);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            });

    })
);