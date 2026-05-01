const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", verifyToken, isAdmin, register);
router.post("/register", register);
router.post("/login", login);

module.exports = router;