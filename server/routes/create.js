const express = require("express");
const { createPlace, listPlace, readPlace, updatePlace, deletePlace } = require("../controllers/create");
const { authCheck } = require("../middleware/authCheck");
const router = express.Router();

//@ENDPOINT METHOD GET
//Get List [http://localhost:5000/api/places]
router.get("/places", listPlace);

//@ENDPOINT METHOD GET
// READ List [http://localhost:5000/api/places]
router.get("/place/:id",readPlace)

//@ENDPOINT METHOD POST
//Create List [http://localhost:5000/api/places]
router.post("/place",authCheck, createPlace);

// @ENDPOINT METHOD PUT
// UPDATE List [http://localhost:5000/api/places/:id]
router.put("/place/:id",authCheck,updatePlace)

//@ENDPOINT METHOD DELETE
//UPDATE List [http://localhost:5000/api/places/:id]
router.delete("/place/:id",authCheck,deletePlace)

module.exports = router;
