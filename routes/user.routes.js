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
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/profile-user", (req, res, next) => {
  res.render("profileuser", {userInSession: req.session.currentUser});
})
//EDIT USER PROFILE
router.get('/edit', (req, res) => {
  res.render('edit-details.hbs')
})

router.post("/edit", (req, res) => {
  User.findByIdAndUpdate( userData._id, {$set: req.body})
  .then(() => {
    res.redirect('profile-user')
  })
})


//DELETE USER PROFILE
router.get('/:id/delete', (req, res) => {
  const {id} = req.params;
  User.model.findByIdAndDelete(id)
    .then(() => res.redirect('/logout')) //doing logout when delete it
    .catch((err) => {
      console.log(`Error while deleting the profile: ${err}`);
      next();
    });
});



module.exports = router;