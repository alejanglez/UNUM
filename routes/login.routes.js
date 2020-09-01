const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require('mongoose');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

//LOGIN//
router.get('/auth/login', (req, res, next) => res.render('login'));

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { 
    email, 
    passwordHash 
  } = req.body;
  console.log(req.body)

  if (!email || !passwordHash) {
    res.render('login', {
      errorMessage: 'All fields are mandatory. Please provide your email and password.'});
    return;
  } else {
    console.log("email and password entered correctly");
  }

  User.findOne({ email })
    .then(user => {
      console.log('searching for email registration')
      if (!user) {
        res.render('login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcrypt.compareSync(passwordHash, user.passwordHash)) {
       
//*** Save user ***//

       req.session.currentUser = user;
        res.redirect('/profile-user');
       // res.render("profileuser");
 
      }else {
        res.render('auth/login', {errorMessage: 'Incorrect password'});
      }
    })
    .catch(error => next(error));
  });

//LOGOUT//

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.render('logout.hbs')
  });
})

/*
router.post("/logout", (req,res) => {
  req.session.destroy();
  res.render('logout.hbs')
  res.redirect("/logout");
})
*/


router.get("/profile-user", (req, res, next) => {
  console.log(req.session);
  res.render("profileuser", {userInSession: req.session.currentUser})
})


module.exports = router;
