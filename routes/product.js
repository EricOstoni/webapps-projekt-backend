const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

//ADD PRODUCT
router.post("/product", async (req, res) => {
  const { name, desc, price, img } = req.body;

  try {
    const product = new Product({
      name,
      desc,
      img,
      price,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET ALL PRODUCTS
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET A PRODUCT BY ID
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
