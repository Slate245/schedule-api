const auth = require("../middleware/auth");
const { Activity, validate } = require("../models/activity");
const express = require("express");
const router = express.Router();

router.use(auth);

router.get("/", (req, res) => {
  res.send(req.user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body._id) {
    return res.status(400).send("Activity already exists");
  }

  const { name, preferredInterval, expectedDuration, description } = req.body;
  const ownerId = req.user._id;
  const obj = { ownerId, name, preferredInterval, expectedDuration };
  if (description) {
    obj.description = description;
  }
  const activity = new Activity(obj);

  try {
    await activity.save();
    return res.send(activity);
  } catch (ex) {
    if (ex.name === "ValidationError") {
      return res.status(400).send(ex.message);
    }
    return res.status(500).send(ex.message);
  }
});

module.exports = router;
