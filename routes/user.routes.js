const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model");
const Skill = require("../models/Skill.model");
const Job = require("../models/Job.model");
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get("/profile-user", (req, res, next) => {
  res.render("profileuser", {
    userInSession: req.session.currentUser
  });
  console.log(req.body)
})
//EDIT USER PROFILE
router.get('/edit', (req, res) => {


  res.render('edit-details.hbs', {
    userInSession: req.session.currentUser
  })
})

router.post("/edit", (req, res) => {
  console.log("Edit profile pressed up")
  let userData = req.session.currentUser
  const {
    name,
    email,
    telephone,
    address,
    passwordHash,
    skill1,
    skill2,
    skill3,
  } = req.body;
  console.log("Profile edit", req.body)

  User.findByIdAndUpdate(userData._id, req.body, {
      new: true
    })
    .then((currentUser) => {
      req.session.currentUser = currentUser
      res.redirect('profile-user')
    })
})

//DELETE USER PROFILE
router.post('/user/:id/delete', (req, res) => {
  const {
    id
  } = req.params;
  User.findByIdAndDelete(id)
    .then(() => res.redirect('/index')) //doing logout when delete it
    .catch((err) => {
      console.log(`Error while deleting the profile: ${err}`);
      next();
    });
});



module.exports = router;