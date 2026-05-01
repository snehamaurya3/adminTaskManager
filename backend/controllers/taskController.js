const db = require("../config/db");

exports.createTask = (req, res) => {
  const { title, description, user_id } = req.body;
  const user = req.user;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description required" });
  }

  if (user.role === "admin") {
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "user_id is required for admin" });
    }

    db.query(
      "INSERT INTO tasks (title, description, user_id, status) VALUES (?, ?, ?, ?)",
      [title, description, user_id, "pending"],
      (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Task created by admin" });
      }
    );
  }

  else {
    db.query(
      "INSERT INTO tasks (title, description, user_id, status) VALUES (?, ?, ?, ?)",
      [title, description, user.id, "pending"],
      (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Task created by user" });
      }
    );
  }
};


exports.getTasks = (req, res) => {
  const user = req.user;

  if (user.role === "admin") {
    db.query("SELECT * FROM tasks", (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  } else {
    db.query(
      "SELECT * FROM tasks WHERE user_id = ?",
      [user.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
      }
    );
  }
};


exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  db.query(
    "UPDATE tasks SET title=?, description=?, status=? WHERE id=?",
    [title, description, status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Task updated successfully" });
    }
  );
};


exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Task deleted successfully" });
  });
};