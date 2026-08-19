require("dotenv").config();
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const couponRoutes = require("./routes/couponRate");
app.use(express.json());
app.use(cors());
app.use("/", productRoutes);
app.use("/", userRoutes);
app.use("/", orderRoutes);
app.use("/", paymentRoutes);
app.use("/", dashboardRoutes);
app.use("/", couponRoutes);
connectDB();
// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});
//Creating Uplaod Endpoint 
app.use('/images',express.static('upload/images'))
// Server Start
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});