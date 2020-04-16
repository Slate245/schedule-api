const express = require("express");
const schedules = require("../routes/schedules");
const activities = require("../routes/activities");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/schedules", schedules);
  app.use("/api/activities", activities);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
