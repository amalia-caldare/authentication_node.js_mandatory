const router = require('express').Router();

const User = require('../models/User.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;
const nodemailer = require('nodemailer');

const nodemailerCredentials = require("../config/nodemailerCredentials.js");

router.use( function (req, res, next) {
    if(req.session.username) {
        res.locals.loggedIn = req.session.username;
    }
    else {
        res.locals.loggedIn = null;
    }
    next();
});

router.post('/login', (req,res) => {
    if(!req.session.username){
        const {username, password} = req.body;
        if(username,password) {
            try {
              User.query().select().where('username',username).then(user => {
                if(user.length > 0) {
                    bcrypt.compare(password, user[0].password, function(err, result) {
                        if(err) {
                            console.log(err)
                        }
                        if(result){
                             req.session.userId = user[0].id;
                             req.session.username = user[0].username;
                             res.redirect('/')
                             res.end('done');
                        } else {
                            return res.status(500).redirect('/login?Wrong username or password')
                        }
                   });
                }
                else {
                   return res.status(500).redirect('/login?Wrong username or password.');
                 }
              });
            }
            catch (error) {
                return res.status(500).redirect('/login?Something went wrong with the DB, try again!');
            }
    
        } else {
            return res.status(500).send({response: "Username or password missing"});
        }  
    }
    else {
        return res.redirect('/profile');
    }
});

router.post('/signup', (req,res) => {
    if(!req.session.username)
    {
        const {username, email, password } = req.body;
        if( username && email && password) {
            if(password.length < 9) { 
                return res.status(400).send({response: "Password must be 8 characters"});
            } else {
                try {
                    User.query().select('username').where('username', username).then(foundUser =>{
                        if(foundUser.length > 0) {
                            return res.status(400).redirect('/signup?User already exists');
    
                        } else {
                            bcrypt.hash(password,saltRounds).then(hashedPassword => {
                                User.query().insert({
                                    username,
                                    email,
                                    password: hashedPassword
                                }).then(createdUser => { 
                                  req.session.username = createdUser.username;
                                  req.session.userId = createdUser.id;
                                  return res.redirect('/profile');
                            });
                            sendEmail(email);
                        });
                       
                    }
                });               
                } catch (error) {
                    return res.status(500).redirect('/login?Something went wrong with the DB. Try again');
                }
            }
        } 
        else {
            return res.status(500).send({response: "Username or password missing"});
        }
    }
   else {
       return res.redirect('/login');
   }
});

router.get('/logout', (req,res) => {
    req.session.destroy(function(error){
        if(error) {
            res.negotiate(error);
        }
        res.redirect('/')
    })
});

function sendEmail(to) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: nodemailerCredentials.email,
            pass: nodemailerCredentials.password,
        }
    });
    
    const options = {
        from: nodemailerCredentials.email,
        to,
        subject: 'Account registration',
        text: 'Account has been created. You can now see and sign up for new courses.'
    };
    
    transporter.sendMail(options, function(error, result){
        if(error) {
            console.log(error);
        } else {
            console.log('Email sent ' + result.response)
        }
    })
 }

module.exports = router;
