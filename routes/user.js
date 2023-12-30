const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const  userControllers = require ("../controllers/user")



router.route("/signup")
//signup
.get( userControllers.renderSignup)
.post(
WrapAsync(userControllers.signup));





router.route("/login")
//login
.get(userControllers.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),userControllers.login);



  //logout
router.get("/logout", userControllers.logout);

module.exports = router;
