const express = require("express");
const schedules = require("../routes/schedules");
const users = require("../routes/users");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/schedules", schedules);
  app.use("/api/users", users);
  app.use(error);
};
