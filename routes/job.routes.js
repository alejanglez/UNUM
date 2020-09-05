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

module.exports = router;
