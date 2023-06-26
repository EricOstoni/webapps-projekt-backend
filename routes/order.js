const express = require("express");
const User = require("../models/user");
//const Product = require("../models/product");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

const router = express.Router();


//CREATE A ORDER
router.post("/order", async (req, res) => {
  const { items, address, payment } = req.body;

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, async (err, jwtuser) => {
    if (err) return res.sendStatus(403);

    const user = await User.findById(jwtuser.id);

    if (user.cart.length === 0) {
      return res.status(400).send("No items in cart");
    }

    const newOrder = new Order({
      user: jwtuser.id,
      items: user.cart,
      address,
      payment,
    });

    try {
      const savedOrder = await newOrder.save();

      user.cart = [];
      await user.save();

      res.send(savedOrder);
    } catch (err) {
      res.status(400).send(err);
    }
  });
});

module.exports = router;
