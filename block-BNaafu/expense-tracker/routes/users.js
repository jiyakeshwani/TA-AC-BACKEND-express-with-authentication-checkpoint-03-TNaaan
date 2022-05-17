var express = require("express");
var router = express.Router();
var Expense = require("../models/Expense");
var Income = require("../models/Income");
var User = require("../models/user");
var flash = require("connect-flash");
var middleware = require("../middlewares/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/register", (res, req, next) => {
  console.log(req.body);
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login", { user });
  });
});

router.post("/login", (res, req, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result, userData) => {
      if (err) return next(err);
      if (!result) {
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      res.render("article", { userData });
    });
  });
});

router.get("/login/forgotpassword", (req, res, next) => {
  let error = req.flash("error")[0];
  let info = req.flash("info")[0];
  res.render("forgotPassword", { error, info });
});

router.get("/dashboard", middleware.loggedInUser, (req, res, next) => {
  let userId = req.session.userId || req.session.passport.user;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) return next(err);
    res.render("dashboard", { user: user });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/users/login");
});
module.exports = router;
