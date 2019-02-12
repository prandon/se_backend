const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/user');

let userController = {};

userController.home = (req, res) => {
    //redirect to home
    res.send({
        message: "home"
    });
}

userController.register = (req, res) => {
    //redirect to registration page
    res.send({
        message: "registration"
    });
}

userController.doRegister = (req, res) => {
    User.register(new User({
        username: req.body.username,
        name: req.body.name
    }), req.body.password, (err, user) => {
        if(err) {
            res.send({
                message: err
            });
        }
        else {
            res.send({
                message: user
            });
        }
    })
}

userController.doLogin = (req, res) => {
    passport.authenticate('local')(req, res, function () {
        res.send({
            message: "Success"
        })
    });
}

userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = userController;