const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const port = process.env.SERVER_PORT;

mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection Success.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  return res.send({
    error: false,
    message: "Server is healthy",
  });
});

var morgan = require('morgan')
app.use(morgan('combined'))

app.use("/users", require("./app/routes/users"));

app.listen(port, () => {
  console.log("Server started listening on PORT : " + port);
});