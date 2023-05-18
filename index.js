import error from "console";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database is connected "))
  .catch((err) => {
    console.log("err");
  });





app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});
