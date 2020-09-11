require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const hbs = require('hbs');

const app = express();

// require database configuration
require("./configs/db.config");
// Requiring Session
require("./configs/session.config");

// Middleware Setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set('useFindAndModify', false);

// Express View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
hbs.registerPartials(path.join(__dirname, "views/partials"));

hbs.registerHelper("ifEqual",function(condition1, condition2, options){
  if(condition1 === condition2){
    return options.fn(this)
  }else{
    return options.inverse(this)
  }
} )

// Requiring Session
require("./configs/session.config")(app);

// default value for title local
app.locals.title =
  "Express boilerplate made with love by your instructional team:) <3";

// const index = require('./routes/index');
// app.use('/', index);
//      |  |  |
//      |  |  |
//      V  V  V
app.use("/", require("./routes/index.routes"));
app.use("/", require("./routes/signup.routes"));
app.use("/", require("./routes/login.routes"));
app.use("/", require("./routes/user.routes"));
app.use("/", require("./routes/job.routes"));

//Code for the video




module.exports = app;
