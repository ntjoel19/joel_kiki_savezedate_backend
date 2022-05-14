//Intall express
const express = require("express");

const app = express();

const userRoutes = require("./routes/user");

//Security module for headers protections
const helmet = require("helmet");
const path = require("path");
//Logger, to get back informations in our terminal
const morgan = require("morgan");

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(helmet());
app.use(morgan("dev"));

app.use("/api/user", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
