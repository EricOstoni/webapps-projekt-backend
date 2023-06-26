const express = require("express");
const User = require("../models/User.js");
const Product = require("../models/Product.js");
const jwt = require("jsonwebtoken");

const router = express.Router();


//ADD TO CART
router.post("/add", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { productId, quantity } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, async (err, jwtuser) => {
    if (err) return res.sendStatus(403);

    const product = await Product.findById(productId);
    if (!product) return res.status(400).send("Product not found");

    const user = await User.findById(jwtuser.id);
    if (!user) return res.status(400).send("User not found");

    const item = {
      product: productId,
      quantity: quantity,
    };

    user.cart.push(item);

    try {
      await user.save();
      res.send("Product added to cart successfully");
    } catch (err) {
      res.status(400).send(err);
    }
  });
});

//GET ALL PRODUCTS FROM THE CART
router.get("/cart", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, async (err, jwtuser) => {
    if (err) return res.sendStatus(403);

    const user = await User.findById(jwtuser.id).populate("cart.product");
    if (!user) return res.status(400).send("User not found");

    res.send(user.cart);
  });
});


//REMOVE PRODUCT FROM THE CART
router.delete("/remove", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { productId } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, async (err, jwtuser) => {
    if (err) return res.sendStatus(403);

    const user = await User.findById(jwtuser.id);
    if (!user) return res.status(400).send("User not found");

    user.cart.pull({ product: productId });

    try {
      await user.save();
      res.send("Product removed from cart successfully");
    } catch (err) {
      res.status(400).send(err);
    }
  });
});

module.exports = router;
