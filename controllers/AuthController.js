const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

let userController = {};

userController.home = (req, res) => {
    //redirect to home
    res.send({
        message: "home"
    });
}

userController.register = (req, res) => {
    jwt.verify(req.token, 'thisismysecretKey', (err, authData) => {
        if(err){
          res.sendStatus(403);
        }
        else{
          res.json({
            message: 'registration',
            authData
        });
        }
    })
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
    //Basic authentication handler
    // passport.authenticate('local')(req, res, function () {
    //     res.send({
    //         message: "Success"
    //     })
    // });

    //Custom authentication handler
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
          return res.json(401, { error: 'message' });
        }
    
        //user has authenticated correctly thus we create a JWT token 
        jwt.sign({user: user}, 'thisismysecretKey', { expiresIn: 30 }, (err, token) => {
            res.json({
              token
            })
        })
    
    })(req, res);
}

userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = userController;