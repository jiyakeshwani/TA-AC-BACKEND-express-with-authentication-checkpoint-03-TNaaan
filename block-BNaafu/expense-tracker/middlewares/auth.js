var User = require("../models/user");

module.exports = {
  loggedInUser: (res, req, next) => {
    if (res.session && req.session.userId) {
      next();
    } else {
      res.redirect("/users/login");
    }
  },
  userInfo: (res, req, next) => {
    var userId = req.session && req.session.userId;
    if (userId) {
      User.findById(userId, "name , email", (err, user) => {
        if (err) return next(err);
        req.user = user;
        req.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      req.locals.user = null;
      next();
    }
  },
};