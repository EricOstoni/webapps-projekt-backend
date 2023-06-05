const express = require("express");
const User = require("../models/user.js");
const Product = require("../models/Product.js");
const { verifyToken } = require("../utils/jwt.js");

const router = express.Router();

// Add to cart route
router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(400).send("Product not found");

  const userId = req.user._id; 
  const user = await User.findById(userId);
  if (!user) return res.status(400).send("User not found");

  const cartItem = {
    product: productId,
    Quantity: quantity,
  };

  user.cart.push(cartItem);

  try {
    await user.save();
    res.send("Product added to cart successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/remove", verifyToken, async (req, res) => {
  const { productId } = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) return res.status(400).send("User not found");

  user.cart.pull({ product: productId });

  try {
    await user.save();
    res.send("Product removed from cart successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});




module.exports = router;
