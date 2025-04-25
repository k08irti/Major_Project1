
const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup

router
  .route("/signup")
  .get(userController.signup)
  .post(wrapAsync(userController.createSignup));

//login 
router
  .route("/login")
  .get(userController.getLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );


//logout

router.get("/logout", userController.logout);

















module.exports = router;