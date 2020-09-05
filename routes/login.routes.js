const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model");
const Job = require("../models/Job.model");
const Skill = require("../models/Skill.model");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//LOGIN//
router.get("/auth/login", (req, res, next) => res.render("login"));

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, passwordHash } = req.body;
  console.log(req.body);

  if (!email || !passwordHash) {
    res.render("login", {
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  } else {
    console.log("email and password entered correctly");
  }

  User.findOne({ email })
    .then((user) => {
      console.log("searching for email registration");
      if (!user) {
        res.render("login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(passwordHash, user.passwordHash)) {
        //*** Save user ***//

        req.session.currentUser = user;
        res.redirect("/profile-user");
        // res.render("profileuser");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    .catch((error) => next(error));
});

//LOGOUT//

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("logout");
  });
});

/*
router.post("/logout", (req,res) => {
  req.session.destroy();
  res.render('logout.hbs')
  res.redirect("/logout");
})
*/

router.get("/profile-user", (req, res, next) => {
  console.log(req.session.currentUser);
  const currentUser = req.session.currentUser;
  const {
    _id,
    name,
    email,
    telephone,
    address,
    jobowner,
    skillprovider,
    jobs,
  } = currentUser;

  User.findById(_id).populate("jobs").populate({path:"jobs", populate:{
    path:"jobowner",
    model:"User"
  }}).populate({path:"jobs", populate:{path:"allocation", model:"User"}}).populate("skills").then(userData => {
    console.log("userData", userData)
    res.render("profileuser", userData)
  })

  // Job.find({jobowner: currentUser._id, jobstatus:"completed"})
  // .then ((returnedJobs) => {
  //   var completedJobs = [];
  //   returnedJobs.forEach(job => {
  //     completedJobs.push(job._id)
  //   })
  //   return completedJobs;
  //   })
  // .catch((error) => next(error));

  // Job.find({ jobowner: currentUser._id })
  //   .then((foundJobs) => {
  //     console.log(foundJobs);
  //     const completedJobs = [];
  //     const promisesArr = foundJobs.map((job, i) => {
  //       if (job.jobstatus === "current") {
  //         Job.findById(job._id).then((jobdetailsFromDB) => {
  //           const {
  //             selectDescription,
  //             additionalInformation,
  //             jobowner,
  //             jobstatus,
  //             allocation,
  //           } = jobdetailsFromDB;
  //           console.log(
  //             "JOB DETAILS FROM DB ",
  //             selectDescription,
  //             additionalInformation,
  //             jobowner,
  //             jobstatus,
  //             allocation
  //           );
  //           return User.findOne({ _id: jobdetailsFromDB.jobowner }).then(
  //             (foundJobOwner) => {
  //               const {
  //                 name: jobOwnerName,
  //                 email: jobOwnerEmail,
  //                 telephone: jobOwnerTelephone,
  //               } = foundJobOwner;

  //               if (!allocation) {
  //                 return {
  //                   name,
  //                   email,
  //                   telephone,
  //                   address,
  //                   selectDescription,
  //                   additionalInformation,
  //                   skillProviderName: "Not yet assigned",
  //                   jobOwnerName,
  //                   jobOwnerEmail,
  //                   jobOwnerTelephone,
  //                   jobstatus,
  //                 };
  //               }
  //               return User.findOne({ _id: jobdetailsFromDB.allocation }).then(
  //                 (foundSkillProvider) => {
  //                   const { name: skillProviderName } = foundSkillProvider;
  //                   return {
  //                     name,
  //                     email,
  //                     telephone,
  //                     address,
  //                     selectDescription,
  //                     additionalInformation,
  //                     skillProviderName,
  //                     jobOwnerName,
  //                     jobOwnerEmail,
  //                     jobOwnerTelephone,
  //                     jobstatus,
  //                   };
  //                 }
  //               );
  //             }
  //           );
  //         });
  //       } else {
  //         completedJobs.push(job._id);
  //       }
  //     });
  //     console.log(promisesArr);
  //     Promise.all(promisesArr).then((promises) => {
  //       console.log("JOOOOBS", promises);
  //       res.render("profileuser", {
  //         recentJobs: promises,
  //         completedJobs: completedJobs,
  //       });
  //     });
    // })
    .catch((error) => next(error))
});

// for (let i=0; i < recentJobs.length; i++){
// const jobId = recentJobs[i]._id;
// Job.findOne({ _id: jobId }).then((jobdetailsFromDB) => {
//   const {
//     selectDescription,
//     additionalInformation,
//     jobowner,
//     jobstatus,
//     allocation,
//   } = jobdetailsFromDB;
//   console.log(
//     selectDescription,
//     additionalInformation,
//     jobowner,
//     jobstatus,
//     allocation
//   );
// User.findOne({ _id: jobdetailsFromDB.jobowner }).then(
//   (foundJobOwner) => {
//     const {
//       name: jobOwnerName,
//       email: jobOwnerEmail,
//       telephone: jobOwnerTelephone,
//     } = foundJobOwner;
//     if (allocation) {
//       //     User.findOne({_id:jobdetailsFromDB.allocation}).then((foundSkillProvider) => {
//       //     const { name:skillProviderName } = foundSkillProvider;
//       //     const infoForProfilePage = {
//       //       name,
//       //       email,
//       //       telephone,
//       //       address,
//       //       selectDescription,
//       //       additionalInformation,
//       //       skillProviderName,
//       //       jobOwnerName,
//       //       jobOwnerEmail,
//       //       jobOwnerTelephone,
//       //       jobstatus
//       //   };
//       // });
//     } else {
//       const infoForProfilePage = {
//         name,
//         email,
//         telephone,
//         address,
//         selectDescription,
//         additionalInformation,
//         skillProviderName: "Not yet assigned",
//         jobOwnerName,
//         jobOwnerEmail,
//         jobOwnerTelephone,
//         jobstatus,
//       };
//     }

module.exports = router;
