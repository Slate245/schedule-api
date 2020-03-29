const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { DateTime } = require("luxon");
const { Schedule, validate } = require("../models/schedule");
const express = require("express");
const router = express.Router();

router.use(auth);

router.get("/:date", async (req, res) => {
  const date = DateTime.fromISO(req.params.date);
  if (!date.isValid) {
    return res.status(400).send("Invalid date");
  }
  const schedule = await Schedule.findOne({
    date: date.toJSON(),
    ownerId: req.user._id
  });
  res.send(schedule);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body._id && (await Schedule.findById(req.body._id))) {
    return res.status(400).send("Schedule already exists");
  }
  if (await Schedule.findOne({ date: req.body.date, ownerId: req.user._id })) {
    return res.status(400).send("Schedule for a given date already exists");
  }

  const { date, workingHours, plannedActivities } = req.body;
  const ownerId = req.user._id;
  const schedule = new Schedule({
    date,
    ownerId,
    workingHours,
    plannedActivities
  });

  try {
    await schedule.save();
    return res.send(schedule);
  } catch (ex) {
    if (ex.name === "ValidationError") {
      return res.status(400).send(ex.message);
    }
    return res.status(500).send(ex.message);
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    { plannedActivities: req.body.plannedActivities },
    { new: true }
  );

  if (!schedule) {
    return res.status(404).send("Schedule with a given ID was not found");
  }

  res.send(schedule);
});

module.exports = router;
