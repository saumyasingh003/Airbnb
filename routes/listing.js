const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const listingControllers = require("../controllers/listing");
const { isLoggedIn, isOwner } = require("../middleware");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errorMessage = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errorMessage);
//   } else {
//     next();
//   }
// };

router
  .route("/")
  //index route
  .get(WrapAsync(listingControllers.index))
  //create route
  .post(
    isLoggedIn,
    // validateListing,
    upload.single("listing[image]"),
  WrapAsync(listingControllers.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  //Show Route
  .get(WrapAsync(listingControllers.showListing))
  //update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    // validateListing,
    WrapAsync(listingControllers.update)
  )
  //Delete  route
  .delete(isLoggedIn, isOwner, WrapAsync(listingControllers.deleteListings));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingControllers.editListings)
);

module.exports = router;
