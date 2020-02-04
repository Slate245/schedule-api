const { parse, isValid } = require("date-fns");
const { Schedule } = require("../models/schedule");
const express = require("express");
const router = express.Router();

router.get("/:date", async (req, res) => {
  const date = parse(req.params.date, "yyyy-MM-dd", new Date(0));
  if (!isValid(date)) {
    return res.status(400).send("Invalid date");
  }
  const schedule = await Schedule.findOne({ date: date });
  res.send(schedule);
});

module.exports = router;
