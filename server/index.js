// libraries
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// endpoints
const getCurrentControlList = require("./endpoints/student/currentControlList");
const login = require("./endpoints/login");
const getSessionList = require("./endpoints/student/sessionList");
const detailedControlList = require("./endpoints/student/detailedControlList");
const getEducatorCurrentControlList = require("./endpoints/educator/controlList");
const controlDetailed = require("./endpoints/educator/controlDetailed");
const controlStudent = require("./endpoints/educator/controlStudent");
const controlEdit = require("./endpoints/educator/controlEdit");
const controlAdd = require("./endpoints/educator/controlAdd");
const calendarControl = require("./endpoints/student/calendarControl");
const getEducatorSessions = require("./endpoints/educator/getEducatorSessions");
const getSessionsGroup = require("./endpoints/educator/getSessionsGroup");
const updateSessionScore = require("./endpoints/educator/updateSessionScore");
const getCalendarList = require("./endpoints/educator/getCalendarList");
const getCalendarDetailed = require("./endpoints/educator/getCalendarDetailed");
const updateCalendar = require("./endpoints/educator/updateCalendar");
const uploadFile = require("./endpoints/uploadFile");
const getFiles = require("./endpoints/getFiles");
const getAllFiles = require("./endpoints/getAllFiles");
const deleteFile = require("./endpoints/deleteFile");

// base settings
const PORT = process.env.PORT || 80;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

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

app.use(express.static(path.resolve(__dirname, "../uploads")));
app.use(express.static(path.resolve(__dirname, "../../front/build")));

// API
app.post("/login", login);

// Student
app.get("/student/control", getCurrentControlList);

app.get("/student/session", getSessionList);

app.get("/student/controlDetailed", detailedControlList);

app.get("/student/calendar", calendarControl);

// Educator
app.get("/educator/control", getEducatorCurrentControlList);

app.get("/educator/controlDetailed", controlDetailed);

app.get("/educator/controlStudent", controlStudent);

app.put("/educator/controlEdit", controlEdit);

app.post("/educator/addScore", controlAdd);

app.get("/educator/sessionList", getEducatorSessions);

app.get("/educator/sessionsGroup", getSessionsGroup);

app.put("/educator/updateSession", updateSessionScore);

app.get("/educator/calendarList", getCalendarList);

app.get("/educator/calendarDetailed", getCalendarDetailed);

app.put("/educator/updateCalendar", updateCalendar);

// files
app.post("/fileUpload", uploadFile);
app.get("/files", getFiles);
app.get("/allFiles", getAllFiles);
app.delete("/deleteFile", deleteFile);

app.get("/uploads/*", (req, res) => {
  res.sendFile(path.resolve(req.originalUrl.replace("/", "")));
});

// get front
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../../front/build", "index.html"));
});
