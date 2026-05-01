const router = require("express").Router();
const { getUsers, deleteUser } = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getUsers);

router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;