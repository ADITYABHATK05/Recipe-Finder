const express = require("express");
const { emailLogin, googleLogin, me, updateProfile } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/login", emailLogin);
router.post("/google", googleLogin);
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);

module.exports = router;