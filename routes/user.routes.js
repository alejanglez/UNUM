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
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.get("/profile-user", (req, res, next) => {
  res.render("profileuser", {
    userInSession: req.session.currentUser,
  });
  console.log(req.body);
});
//EDIT USER PROFILE
router.get("/edit", (req, res) => {
  User.findById(req.session.currentUser._id)
    .populate("jobs")
    .then((userData) => {
      console.log(userData);
      res.render("edit-details", userData);
    })
    .catch((error) => next(error));
});

router.post("/user/:id/edit", (req, res) => {
  console.log("Edit profile pressed up");
  console.log(req.session.currentUser);
  const userId = req.params.id;
  const {
    name,
    email,
    telephone,
    address,
    skill1,
    skill2,
    skill3,
    jobstatus1,
    jobstatus2,
    jobstatus3,
  } = req.body;
  console.log("Profile edit", req.body);

  User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name: name,
        email: email,
        telephone: telephone,
        address: address,
        skills: [skill1, skill2, skill3],
      },
    },
    {
      new: true,
    }
  ).then((currentUser) => {
    if (jobstatus1 === "completed") {
      const jobId = currentUser.jobs[0]._id;
      console.log(jobId);
      Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            jobstatus: "completed",
          },
        },
        {
          new: true,
        }
      )
        .then((updatedJob) => console.log(updatedJob))
        .catch((err) => {
          console.log(`Error while deleting the profile: ${err}`);
          next();
        });
    } else if(jobstatus2 === "completed"){
      const jobId = currentUser.jobs[1]._id;
      console.log(jobId);
      Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            jobstatus: "completed",
          },
        },
        {
          new: true,
        }
      )
        .then((updatedJob) => console.log(updatedJob))
        .catch((err) => {
          console.log(`Error while deleting the profile: ${err}`);
          next();
        });
    } else if(jobstatus3 === "completed"){
      const jobId = currentUser.jobs[2]._id;
      console.log(jobId);
      Job.findByIdAndUpdate(
        jobId,
        {
          $set: {
            jobstatus: "completed",
          },
        },
        {
          new: true,
        }
      )
        .then((updatedJob) => console.log(updatedJob))
        .catch((err) => {
          console.log(`Error while deleting the profile: ${err}`);
          next();
        });
    }
    res.redirect("/profile-user");
  });
});

//DELETE USER PROFILE
router.post("/user/:id/delete", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.render("deletedprofile")) //doing logout when delete it
    .catch((err) => {
      console.log(`Error while deleting the profile: ${err}`);
      next();
    });
});

module.exports = router;
