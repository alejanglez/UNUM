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
    )
});

router.get("/jobdetails/:id", (req, res, next) => {
  const { searchId } = req.params.id;
  Job.findOne({ id: searchId })
    .then((jobdetailsFromDB) => {
        console.log(jobdetailsFromDB);
      User.findOne({ id: jobdetailsFromDB._id }).then((foundUser) => {
        const { selectDescription, image, additionalInformation, jobstatus } = jobdetailsFromDB;
        console.log(selectDescription, image, additionalInformation, jobstatus);
        const { name, address } = foundUser;
        console.log(name, address);
        const infoForJobCard = {
            selectDescription,
            image,
            additionalInformation,
            jobstatus,
            name,
            address
        };
        console.log(infoForJobCard);
        res.render("jobdetails", { infoForJobCard });
      });
    })
    .catch((error) =>
      res.render("jobslist", {
        errorMessage: "Problem retrieving job details from database",
      })
    );
});

module.exports = router;
