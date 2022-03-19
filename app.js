require("./config/mongoose.config");
const express = require("express");
const path = require("path");
const app = express();
// const logger = require("morgan");
const port = process.env.PORT || 3000;
const productRouterV3 = require("./app/product_v3/routes");
const productRouterV4 = require("./app/product_v4/routes");
const cors = require("cors");

// const corsOption = {
//   credentials: true,
//   origin: process.env.URL || "*",
// };
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));

app.use("/api/v3", productRouterV3);
app.use("/api/v4", productRouterV4);

app.use((req, res, next) => {
  res.status(404);
  res.send({
    status: "failed",
    message: "Resource: " + req.originalUrl + " Not Found",
  });
});

app.listen(port, () => console.log("Server: http://localhost:3000"));
