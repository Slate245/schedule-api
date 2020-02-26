const express = require("express");
const schedules = require("../routes/schedules");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/schedules", schedules);
  app.use(error);
};
