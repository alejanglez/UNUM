const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const Skill = require("../models/Skill.model");
const Job = require("../models/Job.model");
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/jobslist", (req, res, next) => {
  Job.find({ jobstatus: "current" })
    .then((jobsFromDB) => res.render("jobslist", { jobsFromDB }))
    .catch((error) =>
      res.render("jobslist", {
        errorMessage: "Problem retrieving jobs from database",
      })
    );
});

router.get("/jobdetails/:id", (req, res, next) => {
  const searchId = req.params.id;
  console.log(searchId);
  Job.findOne({ _id: searchId })
    .then((jobdetailsFromDB) => {
      console.log(jobdetailsFromDB.jobowner);
      User.findOne({ _id: jobdetailsFromDB.jobowner }).then((foundUser) => {
        console.log(foundUser);
        const {
          selectDescription,
          additionalInformation,
          jobstatus,
          _id
        } = jobdetailsFromDB;
        console.log(selectDescription, additionalInformation, jobstatus);
        const { name, address } = foundUser;
        console.log(name, address);
        const infoForJobCard = {
          selectDescription,
          additionalInformation,
          jobstatus,
          name,
          address,
          jobid: _id
        };
        console.log(infoForJobCard);
        res.render("jobdetails", infoForJobCard);
      });
    })
    .catch((error) =>
      res.render("jobslist", {
        errorMessage: "Problem retrieving job details from database",
      })
    );
});

router.get("/completedjobdetails/:id", (req, res, next) => {
  const searchId = req.params.id;
  console.log(searchId);
  Job.findOne({ _id: searchId })
    .then((jobdetailsFromDB) => {
      console.log(jobdetailsFromDB.jobowner);
      User.findOne({ _id: jobdetailsFromDB.jobowner }).then((foundUser) => {
        console.log(foundUser);
        const {
          selectDescription,
          additionalInformation,
          jobstatus,
        } = jobdetailsFromDB;
        console.log(selectDescription, additionalInformation, jobstatus);
        const { name, address } = foundUser;
        console.log(name, address);
        const infoForJobCard = {
          selectDescription,
          additionalInformation,
          jobstatus,
          name,
          address,
        };
        console.log(infoForJobCard);
        res.render("completedjobdetails", infoForJobCard);
      });
    })
    .catch((error) =>
      res.render("jobslist", {
        errorMessage: "Problem retrieving job details from database",
      })
    );
});

router.get("/createjob", (req, res, next) => res.render("createjob"));

router.post("/createjob", (req, res, next) => {
  console.log("createjob form submitted");
  const {
    jobDescription,
    additionalInfoJob,
  } = req.body;
  console.log(req.body);

switch (jobDescription) {
  case "Painting and decorating":
    icon = "images/icons/paintinganddecorating1.png";
    break;
  case "Babysitting":
    icon = "images/icons/babysitting1.png";
    break;
  case "Cooking":
    icon = "images/icons/cooking1.png";
    break;
  case "Web development":
    icon = "images/icons/web development1.png";
    break;
  case "Cleaning":
    icon = "images/icons/cleaning1.png";
    break;
  case "Woodwork and general repairs":
    icon = "images/icons/carpenter1.png";
    break;
  case "Gardening":
    icon = "images/icons/gardening1.png";
    break;
  case "Ironing":
    icon = "images/icons/ironing1.png";
    break;
  case "Homework help and tutoring":
    icon = "images/icons/homework1.png";
    break;
  case "Hairdressing":
    icon = "images/icons/hairdresser1.png";
    break;
  case "Car washing (inside and out)":
    icon = "images/icons/carwashing1.png";
    break;
  default:
    icon = "image not found";
}
Job.create({
  selectDescription: jobDescription,
  image: icon,
  additionalInformation: additionalInfoJob,
  jobowner: req.session.currentUser._id,
  jobstatus: "current",
})
  .then((newJob) => {
    console.log(newJob._id);
    User.findByIdAndUpdate(req.session.currentUser._id, {
      $addToSet: { jobs: newJob._id },
    })
      .then((updatedUser) => {
        console.log(updatedUser);
        res.redirect("/profile-user");
      })
      .catch((err) => console.log("USER UPDATE ERROR", err));
  })
  .catch((err) => {
    console.log("JOB ERROR", err);
    next(err);
  });
})

router.get("/acceptjob/:id", (req, res, next) => {
  const jobid = req.params.id;
  User.findByIdAndUpdate(req.session.currentUser._id, {
    $addToSet: { jobs: jobid },
  }).then ((updatedUser) => {
    Job.findByIdAndUpdate(jobid, {
      allocation: updatedUser._id
    }).then(() => res.redirect("/profile-user"))
  })
  .catch((err) => {
    console.log("Error accepting job", err);
    next(err);
  });
})


module.exports = router;
