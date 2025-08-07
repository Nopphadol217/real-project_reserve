const express = require("express");
const router = express.Router();
const { actionFavorite, listFavorites } = require("../controllers/favorite");
const { authCheck } = require("../middleware/authCheck");

// POST /api/favorite - Add or Remove favorite
router.post("/favorite", authCheck, actionFavorite);

// GET /api/favorites - Get user's favorites
router.get("/favorites", authCheck, listFavorites);

module.exports = router;
