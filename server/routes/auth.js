const express = require("express");
const {
  register,
  login,
  googleLogin,
  logout,
  refreshToken,
  updateProfile,
} = require("../controllers/auth");
const { authCheck } =require("../middleware/authCheck")
const router = express.Router();
const csrf = require("csurf");

//@ENDPOINT METHOD POST
//Register User [http://localhost:5000/api/register]
router.post("/register", register);

//@ENDPOINT METHOD POST
//Login User [http://localhost:5000/api/login]
router.post("/login", login);

//@ENDPOINT METHOD POST
//Login User [http://localhost:5000/api/auth/google-login]
router.post("/auth/google-login", googleLogin);

// routes/authRoute.js
router.post("/refresh", refreshToken);

router.post("/logout", logout);

//@ENDPOINT METHOD PUT
//Update Profile [http://localhost:5000/api/auth/profile]
router.put("/profile/edit", authCheck, updateProfile);

module.exports = router;
