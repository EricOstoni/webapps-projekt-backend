const express = require("express");
const User = require("../models/user");
//const Product = require("../models/product");
const Order = require("../models/Order");
const { verifyToken } = require("../utils/jwt");

const router = express.Router();
router.post("/create", verifyToken, async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) return res.status(400).send("User not found");

  if (user.cart.length == 0) return res.status(400).send("Your cart is empty");

  const { address, zip, city, card } = req.body;

  if (!(address && zip && city && card)) {
    return res.status(400).send("All fields are required");
  }

  const products = user.cart.map((item) => {
    return {
      product: item.product,
      quantity: item.quantity,
    };
  });

  const order = new Order({
    user: userId,
    products: products,
    address: {
      address: address,
      zip: zip,
      city: city,
    },
    card: card,
  });

  try {
    const savedOrder = await order.save();

    user.cart = [];
    await user.save();

    return res.status(201).send(savedOrder);
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;
