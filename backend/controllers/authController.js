const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role || "user"],
//     (err) => {
//       if (err) return res.status(500).send(err);
//       res.send("User created");
//     }
//   );
// };
(err, result) => {
      if (err) {
        console.error("REGISTER ERROR:", err);  
        return res.status(500).json(err);
      }

      res.json({ message: "User created successfully" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send("User not found");

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) return res.status(401).send("Invalid password");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secret",
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  });
};