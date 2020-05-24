const router = require('express').Router();

const User = require('../models/User.js');
const Elective = require('../models/Elective.js');

router.get('/profile', async (req, res) => {
    if(req.session.username) {
        const electivesOfUser = await Elective.query().select('course_name').where('user_id', req.session.userId);
        const userDetails = await User.query().select().where('username', req.session.username);
        return res.render('profile/profile', {user: userDetails,
                                              course: electivesOfUser })
        }
    else {
        return res.redirect("/login")
    }
 });

router.get('/users', async (req, res) => {
   const electivesOfUser = await Elective.query().select('course_name').where('user_id', req.session.userId);
   const userDetails = await User.query().select().where('username', req.session.username);
   return res.send({ user: userDetails,
                     course: electivesOfUser});
});

router.post('/newcourse', (req,res) => {
    const course_name = req.body.course_name;
    if(course_name) 
        try {
            Elective.query().select().where('course_name', course_name).where('user_id', req.session.id)
                                        .then(course =>{
              if(course.length > 0) {
                  res.send({response: "You are already enrolled in this course"})
              }
              else {
                  Elective.query().insert({
                    course_name,
                    user_id: req.session.userId
                  }).then(res.redirect("/profile"))
              }
            })
    }
    catch(error) {
        console.log(error)
        res.send({response: 'error'})
    } });

router.get('/newcourse', (req,res) => {
    if(req.session.username) {
        return res.render('newcourse/newcourse');
    }
    else res.redirect('/login');
})
router.get('/setsessionvalue', (req, res) => {
    req.session.payingAttention = true;
    return res.send({ response: "OK" });
});

router.get('/getsessionvalue', (req, res) => {
    return res.send({ response: req.session.payingAttention });
});

module.exports = router;