var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware/auth");
var User = require("../models/user");
var Expense = require("../models/expense");
var Income = require("../models/income");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    var user = req.user;

    res.redirect("/success");
  }
);

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    var user = req.user;

    res.redirect("/success");
  }
);

module.exports = router;
