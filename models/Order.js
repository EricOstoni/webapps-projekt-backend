const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  address: {
    address: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
  },
  card: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Order", OrderSchema);
