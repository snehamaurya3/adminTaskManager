const db = require("../config/db");

exports.getUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User deleted");
  });
};