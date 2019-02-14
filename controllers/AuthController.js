const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const emailKey = require('../mail_key');
const async = require('async');
const crypto = require('crypto');

let userController = {};

userController.home = (req, res) => {
    sgMail.setApiKey(emailKey);
    const msg = {
        to: 'pranjal.nartam@gmail.com',
        from: 'support@bpjadhav.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);

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
            res.send({
              token
            })
        })
    
    })(req, res);
}

userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

userController.updatePassword = function(req, res) {
    var username = req.body.username;
    var newPass = req.body.password;
    console.log(username, newPass);
    User.findByUsername(username).then(function(sanitizedUser) {
        console.log(sanitizedUser);
        if (sanitizedUser) {
            sanitizedUser.setPassword(newPass, function() {
                sanitizedUser.save();
                res.send({message :'Password reset successful'});
            });
        } else {
            res.send({message: 'User does not exist'});
        }
    }, function(err) {
        console.error(err);
    })
}

userController.forgotPassword = function(req, res) {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ username: req.body.username }, function(err, user) {
            if (!user) {
              return res.send({message :'No account with that email address exists.'});
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
            sgMail.setApiKey(emailKey);
            var msg = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + 'yourhosthere' + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            sgMail.send(msg, function(err){
                done(err, 'done');
            });
        }
      ], function(err) {
        if (err) return next(err);
        res.send({message: 'Check email'});
      });
}

module.exports = userController;