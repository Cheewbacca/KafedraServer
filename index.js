// libraries
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// endpoints
const getCurrentControlList = require("./endpoints/student/currentControlList");
const login = require("./endpoints/login");

// base settings
const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// get front
app.get("/", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../front/build", "index.html"));
});

// API
app.post("/login", login);

app.get("/student/control", getCurrentControlList);
