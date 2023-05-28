// libraries
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// endpoints
const login = require("./endpoints/login");
const register = require("./endpoints/register");
const getMinds = require("./endpoints/minds/getMinds");
const getSingleMind = require("./endpoints/minds/getSingleMind");
const updateMind = require("./endpoints/minds/updateMind");
const addMind = require("./endpoints/minds/addMind");
const deleteMind = require("./endpoints/minds/deleteMind");
const getWishes = require("./endpoints/wishes/getWishes");
const getSingleWish = require("./endpoints/wishes/getSingleWish");
const updateWish = require("./endpoints/wishes/updateWish");
const addWish = require("./endpoints/wishes/addWish");
const deleteWish = require("./endpoints/wishes/deleteWish");

// base settings
const PORT = process.env.PORT || 80;

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
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.resolve(__dirname, "../../front/build")));

// API
app.post("/login", login);
app.post("/register", register);

// minds
app.get("/minds", getMinds);
app.get("/mind", getSingleMind);
app.post("/updateMind", updateMind);
app.post("/addMind", addMind);
app.delete("/deleteMind", deleteMind);

// wishes
app.get("/wishes", getWishes);
app.get("/wish", getSingleWish);
app.post("/updateWish", updateWish);
app.post("/addWish", addWish);
app.delete("/deleteWish", deleteWish);

// get front
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../../front/build", "index.html"));
});
