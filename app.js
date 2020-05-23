const express = require('express');
const app = express();

const fs = require('fs');

app.use(express.urlencoded({ extended: false }))

app.use(express.json());

app.use(express.static('public'));

const navbarPage = fs.readFileSync(__dirname + "/public/navbar/navbar.html", "utf8")
const signupPage = fs.readFileSync(__dirname + "/public/signup/signup.html", "utf8");
const loginPage = fs.readFileSync(__dirname + "/public/login/login.html", "utf8");
const userPage = fs.readFileSync(__dirname + "/public/profile/profile.html", "utf8");

const session = require('express-session');

//Copy the config.template.json file and fill out your own secret
const config = require('./config/config.json');

app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, //15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });

// app.use(limiter);

// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, //15 minutes
//     max: 8 // limit each IP to 8 requests per windowMs
// });

//  app.use('/signup',authLimiter);
//  app.use('/login', authLimiter);

// Setup Knex with Objection

const {Model} = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

const knex = Knex(knexfile.development);

// give the knex instance to objection
Model.knex(knex);

// Setup the routes with app

const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');

app.use(authRoute);
app.use(usersRoute);

app.get('/', (req,res) =>{
    return res.redirect('/login')
});

app.get('/signup', (req,res) => {
    return res.send(navbarPage + signupPage);
});

app.get('/login', (req,res) => {
    if(req.session.username){
        return res.redirect("/profile");
    }
      else {
        return res.send(navbarPage + loginPage);
      }
});

app.get('/profile', (req,res) => {
    if(req.session.username) {
        return res.send(navbarPage + userPage);
    }
    else {
        return res.redirect("/login")
    }
});

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log('Server is running on the port', PORT);
})