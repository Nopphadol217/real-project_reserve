const express = require("express");
const {
  searchPlaces,
  getCategories,
  getLocations,
} = require("../controllers/search");

const router = express.Router();

// Search places with filters
router.get("/", searchPlaces);

// Get available categories
router.get("/search/categories", getCategories);

// Get available locations
router.get("/search/locations", getLocations);

module.exports = router;
