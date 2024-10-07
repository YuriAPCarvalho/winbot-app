const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const env = require("dotenv").config();
app.use(
  cors({
    credentials: false,
    origin: "*",
  })
);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(env.REACT_APP_PORT, () => {
  console.log("Server is running on port " + env.REACT_APP_PORT);
});
