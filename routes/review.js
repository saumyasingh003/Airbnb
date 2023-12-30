const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const WrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");
const Listing = require("../models/listing");
const { isLoggedIn, isreviewAuthor } = require("../middleware");
const listingControllers = require("../controllers/listing");
const reviewControllers = require("../controllers/review");






const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

//review
//post
router.post(
  "/",
  isLoggedIn,
  validateReview,
  WrapAsync(reviewControllers.addReview));

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  WrapAsync(reviewControllers.deleteReview));

module.exports = router;
