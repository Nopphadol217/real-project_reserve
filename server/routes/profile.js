const express = require("express")
const { profile, listUser } = require("../controllers/profile")
const { authCheck } = require("../middleware/authCheck")
const { refreshToken } = require("../controllers/auth")
const router = express.Router()



//@ENDPOINT METHOD GET
//Register User [http://localhost:5000/api/profile]
router.get("/profile",authCheck,profile)

//@ENDPOINT METHOD GET
//Read User [http://localhost:5000/api/readuser]
router.get("/manage-users",listUser)


module.exports = router