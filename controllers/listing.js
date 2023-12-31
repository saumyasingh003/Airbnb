const Listing = require("../models/listing");
const mapToken  = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });


//index
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

//new
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//show
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", " Listing Your requested does not Exist!");
    res.redirect("/listings");
  }
 
   console.log(listing);res.render("listings/show.ejs", { listing });
};

//create
module.exports.createListing = async (req, res, next) => {
  try {
   console.log('API call started')
    const response = await geoCodingClient.forwardGeocode({
      query: req.body.location,
      limit: 1
    }).send();

    if (!response || !response.body || !response.body.features || response.body.features.length === 0) {
      throw new Error("Invalid geocoding response");
    }

    const coordinates = response.body.features[0].geometry.coordinates;
    console.log("Coordinates are:",coordinates)
    
    const newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      price: req.body.price,
      country: req.body.country,
      location:req.body.location,
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
    });

    newListing.owner = req.user._id;
    
    
    const savedListing = await newListing.save();
    console.log(savedListing)
    console.log("API call ended")
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Error creating listing");
    res.status(500).redirect("/listings");
  }
};

//edit
module.exports.editListings = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (error) {
    console.error("Error editing listing:", error);
    req.flash("error", "Error editing listing");
    res.status(500).redirect("/listings");
  }
};


module.exports.update = async (req, res) => {
  let { id } = req.params;
let { location, ...otherFields } = req.body; 
let response = await geoCodingClient.forwardGeocode({
  query: location,
  limit: 1
}).send();

if (!response || !response.body || !response.body.features || response.body.features.length === 0) {
  throw new Error("Invalid geocoding response");
}

const coordinates = response.body.features[0].geometry.coordinates;

let updatedListing = await Listing.findByIdAndUpdate(
  id,
  {
    ...otherFields, 
    location,      
    geometry: {
      type: "Point",
      coordinates: coordinates,
    },
  },
  { new: true } // Ensure you get the updated document
);

if (typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  updatedListing.image = { url, filename };
}

await updatedListing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//delete
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing deleted!");
  res.redirect("/listings");
};
