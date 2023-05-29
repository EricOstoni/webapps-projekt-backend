const express = require("express");
// import require from "express";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
// const auth = require("./routes/auth");
const product = require("./routes/product");
const user = require("./routes/user")
const order = require("./routes/order");

const auth = require("./routes/auth.js");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      w: "majority",
    },
  })
  .then(() => console.log("database is connected "))
  .catch((err) => {
    console.log("error");
  });

app.use("/auth", auth);
app.use("/products", product);
app.use("/users", user);
app.use("/orders", order); 

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});
