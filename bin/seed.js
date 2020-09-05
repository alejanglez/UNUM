const mongoose = require("mongoose");
const DB_NAME = "UNUM";
const User = require("../models/User.model.js");
const Skill = require("../models/Skill.model.js");
const Job = require("../models/Job.model.js");

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  {
    name: "Admin",
    email: "admin@email.com",
    telephone: "061234567",
    address: "12 Admin Street, Administration",
    passwordHash: "1234ABab",
    skillprovider: "false",
    additionalinformation: "Super-user",
    jobowner: "false",
    signupagreement: "true",
    skills: [],
    jobs: []
  },
];

User.create(users)
  .then((userFromDB) => {
    console.log(`Created new super user:${userFromDB}`);
    User.findOne({ email: "admin@email.com" }).then((foundUser) => {
      const superUserid = foundUser._id;
      const skills = [
        {
          selectDescription: "Painting and decorating",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Babysitting",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Cooking",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Web development",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Cleaning",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Woodwork and general repairs",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Gardening",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Ironing",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Homework help and tutoring",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Hairdressing",
          skillprovider: [superUserid],
        },
        {
          selectDescription: "Car washing (inside and out)",
          skillprovider: [superUserid],
        },
      ];
      const jobs = [
        {
          selectDescription: "Painting and decorating",
          image: "/images/icons/paintinganddecorating1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Babysitting",
          image: "/images/icons/babysitting1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Cooking",
          image: "/images/icons/cooking1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Web development",
          image: "/images/icons/web development1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Cleaning",
          image: "/images/icons/cleaning1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Woodwork and general repairs",
          image: "/images/icons/carpenter.jpg",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Gardening",
          image: "/images/icons/gardening1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Ironing",
          image: "/images/icons/ironing1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Homework help and tutoring",
          image: "/images/icons/homework1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Hairdressing",
          image: "/images/icons/hairdresser1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
        {
          selectDescription: "Car washing (inside and out)",
          image: "/images/icons/carwashing1.png",
          additionalInformation: "Example for icon",
          jobowner: [superUserid],
          jobstatus: "completed",
          allocation: [superUserid],
        },
      ];
      Skill.create(skills)
        .then((skillsFromDB) => {
          skillsFromDB.map((skill) => {
            console.log(skill._id);
            User.findByIdAndUpdate(superUserid, 
              {$addToSet: { skills: skill._id },}, {new:true});
              console.log(`User with id:${superUserid} successfully updated`)
            })})
        .catch((err) =>
          console.log(`An error occurred while getting skills from the DB: ${err}`)
        );
      Job.create(jobs)
        .then((jobsFromDB) => {
          console.log(`Created ${jobsFromDB.length} jobs`);
          mongoose.connection.close();
        })
        .catch((err) =>
          console.log(
            `An error occurred while getting jobs from the DB: ${err}`
          )
        );
    });
  })
  .catch((err) =>
    console.log(
      `An error occurred while getting super user from the DB: ${err}`
    )
  )
  .catch((error) =>
    console.log("An error occurred during the seeding process")
  );
