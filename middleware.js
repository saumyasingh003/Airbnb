const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {reviewSchema} = require("./schema");




module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to Create Listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//owner empty hai
module.exports.isOwner =async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // if (!listing.owner.equals(res.locals.currUser._id)) {
  //   req.flash("error", "You are not the  Owner of  this listing!");
  //   return res.redirect(`/listings/${id}`);
  // }
  next();
}

module.exports.isreviewAuthor =async (req, res, next) => {
  let { id ,reviewId } = req.params;
  let review = await Review.findById(reviewId );
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the  Author of  this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
