const express = require("express");
const {
  registerRequest,
  registerVerify,
  login,
  refresh,
  logout,
} = require("../controllers/user.controllers");

const router = express.Router();

// Step 1: request OTP for registration
router.post("/register/request", registerRequest);

// Step 2: verify OTP and create account
router.post("/register/verify", registerVerify);

// Login with email + password
router.post("/login", login);

// Refresh access token
router.post("/refresh", refresh);
router.post("/logout", logout); 

module.exports = router;
