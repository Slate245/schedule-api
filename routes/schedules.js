const { DateTime } = require("luxon");
const { Schedule } = require("../models/schedule");
const express = require("express");
const router = express.Router();

router.get("/:date", async (req, res) => {
  const date = DateTime.fromISO(req.params.date);
  if (!date.isValid) {
    return res.status(400).send("Invalid date");
  }
  const schedule = await Schedule.findOne({ date: date.toJSON() });
  res.send(schedule);
});

module.exports = router;
