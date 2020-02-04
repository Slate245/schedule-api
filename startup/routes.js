const express = require("express");
const schedules = require("../routes/schedules");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/schedules", schedules);
};
