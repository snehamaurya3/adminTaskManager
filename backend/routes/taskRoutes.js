const router = require("express").Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;