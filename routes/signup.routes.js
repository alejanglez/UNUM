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

router.get("/auth/signup", (req, res, next) => res.render("signup"));

router.get("/auth/tandcs", (req, res, next) => res.render("tandcs"));

router.post("/signup", (req, res, next) => {
  console.log("signup form submitted");
  const {
    name,
    email,
    telephone,
    address,
    passwordHash,
    skillprovider,
    skill1,
    skill2,
    skill3,
    additionalinformation,
    jobowner,
    jobDescription,
    additionalInfoJob,
    signupagreement,
  } = req.body;
  console.log(req.body);

  if (email == "" || passwordHash == "") {
    res.render("signup", {
      errorMessage:
        "Email and password are both compulsory fields. Please enter your email address and a password.",
    });
    return;
  } else {
    console.log("email and password entered correctly");
  }

  if (signupagreement !== "true") {
    res.render("signup", {
      errorMessage:
        "Agreement to the terms and conditions is mandatory. Please read our terms and conditions and confirm your agreement by checking the box.",
    });
    return;
  } else {
    console.log("terms and conditions agreed");
  }

  User.findOne({ email })
    .then((user) => {
      console.log("searching for user with same email");
      if (user) {
        res.render("signup", {
          errorMessage:
            "Only one user per email address is permitted. Please enter a unique email address.",
        });
      } else {
        console.log("email is unique");
      }
      return;
    })
    .catch((error) =>
      res.render("signup", { errorMessage: "Email must be unique" })
    );

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(passwordHash)) {
    res.status(500).render("signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  } else {
    console.log("password meets restrictions");
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(passwordHash, salt))
    .then((hashedPassword) => {
      console.log(hashedPassword);
      User.create({
        name,
        email,
        telephone,
        address,
        passwordHash: hashedPassword,
        skillprovider,
        additionalinformation,
        jobowner,
        signupagreement,
        jobDescription,
        additionalInfoJob
      })
      .then((newUser) => {
        console.log("Newly created user is: ",newUser);
        if (skillprovider) {
          User.findByIdAndUpdate(newUser._id, {$addToSet: {skills: [skill1, skill2, skill3]},}).then(() =>{
          const skillsarray = [skill1, skill2, skill3].map((skill) =>
            Skill.findOne({ selectDescription: skill }).then((foundSkill) =>
              console.log(foundSkill) || Skill.findByIdAndUpdate(foundSkill._id, {
                $addToSet: { skillprovider: newUser._id },
              })
            ))}
          )
          Promise.all(skillsarray).then(() => {
            console.log(req.session.currentUser);
            res.render('profileuser')
          });
        } else {
          User.findByIdAndUpdate(newUser._id, {$addToSet: {jobs: jobDescription},}).then(() =>{
          switch(jobDescription){
            case 'Painting and decorating':
              icon = 'images/icons/paintinganddecorating.jpg';
              break;
            case 'Babysitting':
              icon = 'images/icons/babysitting.jpg';
              break;
            case 'Cooking':
              icon = 'images/icons/cooking.jpg';
              break;
            case 'Web development':
              icon = 'images/icons/web development.png';
              break;
            case 'Cleaning':
              icon = 'images/icons/cleaning.jpg';
              break;
            case 'Woodwork and general repairs':
              icon = 'images/icons/carpenter.jpg';
              break;
            case 'Gardening':
              icon = 'images/icons/gardening.jpg';
              break;
            case 'Ironing':
              icon = 'images/icons/ironing.jpg';
              break;
            case 'Homework help and tutoring':
              icon = 'images/icons/homework.png';
              break;
            case 'Hairdressing':
              icon = 'images/icons/hairdresser.png';
              break;
            case 'Car washing (inside and out)':
              icon = 'images/icons/carwashing.jpg';
              break;
            default:
              icon = 'image not found';
          };
          Job.create({
            selectDescription: jobDescription,
            image: icon,
            additionalInformation: additionalInfoJob, 
            jobowner: newUser._id,
            jobstatus: "current",
          }).then(() => {
            console.log(req.session.currentUser);
            res.render('profileuser')})
            .catch((err) => {
              console.log("JOB ERROR", err);
              next(err);
            })
          })}
        })
      })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("signup", {
          errorMessage: "Email must be unique. Email is already in use.",
        });
      } else {
        next(error);
      }
    })
  })

module.exports = router
