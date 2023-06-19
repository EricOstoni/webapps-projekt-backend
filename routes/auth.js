const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
//const { generateToken } = require("../utils/jwt.js");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  const userCheck = await User.findOne({ email });
  if (userCheck) return res.status(400).send("Email already exists");

  const salt = await bcrypt.genSalt(7);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    cart: [],
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Email is not found");

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) return res.status(400).send("Invalid password");

  const token = jwt.sign({ id: user._id.toString() }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
});

module.exports = router;
