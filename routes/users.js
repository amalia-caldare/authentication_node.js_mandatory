const router = require('express').Router();

const User = require('../models/User.js');

router.get('/users', async (req, res) => {
    const allUsersWithElectives = await User.query().select('username').where('username', req.session.username).withGraphFetched('electives');
    return res.send({ response: allUsersWithElectives });
});

router.get('/user', (req,res) => {
    User.query().select().where('username', req.session.username).then(user => {
    return res.send({response: user[0].username})
   })
});

router.get('/setsessionvalue', (req, res) => {
    req.session.payingAttention = true;
    return res.send({ response: "OK" });
});

router.get('/getsessionvalue', (req, res) => {
    return res.send({ response: req.session.payingAttention });
});

module.exports = router;