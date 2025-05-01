const Listing = require("../models/listing.js");

// Controller for index route
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller for new listing form
module.exports.newFormRender = (req, res) => {
  res.render("listings/new");
};

// Controller for creating a new listing
module.exports.createRoute = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing); // Add validation for listing data
    if (req.file) {
      newListing.image = req.file.path; // Store the image path from multer upload
    }
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller for showing a single listing
module.exports.showRoute = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show", { listing });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller for rendering the edit form for a listing
module.exports.editRoute = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/edit", { listing });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller for updating a listing
module.exports.updateRoute = async (req, res) => {
  try {
    const updatedData = req.body.listing;
    if (req.file) {
      updatedData.image = req.file.path; // Update the image if a new one is uploaded
    }
    const listing = await Listing.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Controller for deleting a listing
module.exports.deleteRoute = async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
