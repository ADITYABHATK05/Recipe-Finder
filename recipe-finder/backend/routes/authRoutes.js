const express = require("express");
const { emailLogin, googleLogin, me, updateProfile, verifyOtp, deleteAccount } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", emailLogin);
router.post("/google", googleLogin);
router.post("/verify-otp", verifyOtp);
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);
router.delete("/delete-account", requireAuth, deleteAccount);

module.exports = router;