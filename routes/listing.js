const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); 
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const cookieParser = require("cookie-parser");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage});

// Helper to escape regex
function escapeRegex(string) {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

  
  // Enhanced 🔍 Search Route
  router.get("/search", wrapAsync(async (req, res) => {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      // If no query or empty string, redirect or show all
      const allListings = await Listing.find({});
      return res.render("listings/index", { allListings });
    }
  
    const regex = new RegExp(escapeRegex(query), 'i');
    const listings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex },
        { description: regex },
        { country: regex }
      ]
    });
  
    res.render("listings/index", { allListings: listings });
  }));




router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createRoute)
);



//New & Create route 

router.get("/new", isLoggedIn, listingController.newFormRender);

// Route: /listings/category/:categoryName

router.get("/category/:categoryName", async (req, res) => {
    const { categoryName } = req.params;

    const filteredListings = await Listing.find({
        category: { $regex: new RegExp(`^${categoryName}$`, "i") } // 👈 case-insensitive match
    });

    res.render("listings/index", { allListings: filteredListings });
});

// show route 

router.get("/:id", wrapAsync(listingController.showRoute));



// edit and update route 

router.get("/:id/edit", wrapAsync(listingController.editRoute));

// updated 

router.put("/:id",isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, 
     wrapAsync(listingController.updateRoute));

//delete route 

router.delete("/:id", isLoggedIn ,isOwner, wrapAsync(listingController.deleteRoute));



module.exports = router;