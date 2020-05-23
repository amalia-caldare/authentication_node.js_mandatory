const router = require('express').Router();

const User = require('../models/User.js');

const bcrypt = require('bcrypt');
const saltRounds = 12;

//protection to check if user is authenticated.
const redirectLogin = (req, res, next) => {
    if(!req.session.username) {
        res.redirect('/login');
    } else 
        next();
}

const redirectProfile = (req, res, next) => {
    if(req.session.username) {
        res.redirect('/login');
    } else 
        res.redirect('/profile');
} 

router.post('/login', (req,res) => {
    if(!req.session.username){
        const {username, password} = req.body;
        if(username,password) {
            try {
                User.query().select().where('username',username).then(user => {
                       if(bcrypt.compare(password, user[0].password)) {
                             req.session.username = user[0].username;
                             res.redirect('/profile');
                             res.end();
                            }
                })
            }
            catch (error) {
                return res.status(500).send({response: "Something went wrong with the DB"});
            }
        } else {
            return res.status(500).send({response: "Username or password missing"});
        }  
    }
    else {
        return res.redirect("/profile")
    }
 
});

router.post('/signup', (req,res) => {
    const {username, password } = req.body;
    if( username && password) {
        if(password.length < 9) { 
            return res.status(400).send({response: "Password must be 8 characters"});
        } else {
            try {
                User.query().select('username').where('username', username).then(foundUser =>{
                    if(foundUser.length > 0) {
                        return res.status(400).send({response: "User already exists"});

                    } else {
                        bcrypt.hash(password,saltRounds).then(hashedPassword => {
                            User.query().insert({
                                username,
                                password: hashedPassword
                            }).then(createdUser => {
                              return res.send({response: `The user ${createdUser.username} was created`});
                        });
                    });
                   
                }
            });               
            } catch (error) {
                return res.status(500).send({response: "Something went wrong with the DB"});
            }
        }
    } 
    else {
        return res.status(500).send({response: "Username or password missing"});
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

module.exports = router;
