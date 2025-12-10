const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== "web250user" || password !== "LetMeIn!") {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  // creates JWT
  const token = jwt.sign(
    { username: "web250user", role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

module.exports = router;
