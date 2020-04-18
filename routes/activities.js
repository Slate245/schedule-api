const auth = require("../middleware/auth");
const { Activity, validate } = require("../models/activity");
const express = require("express");
const router = express.Router();

router.use(auth);

function createActivityFromRequest(req) {
  const activityObject = { ...req.body };
  if (activityObject.description === "") {
    delete activityObject.description;
  }
  activityObject.ownerId = req.user._id;

  return activityObject;
}

router.get("/", async (req, res) => {
  const activities = await Activity.find({ ownerId: req.user._id });
  res.send(activities);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body._id) {
    return res.status(400).send("Activity already exists");
  }

  const activityObject = createActivityFromRequest(req);

  const activity = new Activity(activityObject);

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

router.put("/:id", async (req, res) => {
  if (req.body.ownerId && req.body.ownerId !== req.user._id) {
    return res.status(401).send("Access to activities of another user denied.");
  }
  delete req.body.ownerId;
  if (req.body.__v) delete req.body.__v;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const activityObject = createActivityFromRequest(req);

  const activity = await Activity.findByIdAndUpdate(
    req.params.id,
    activityObject,
    {
      new: true,
    }
  );
  if (!activity) {
    return res.status(404).send("Activity with a given ID was not found");
  }

  res.send(activity);
});

router.delete("/:id", async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    return res.status(404).send("Activity with given ID not found");
  }

  if (activity.ownerId.toString() !== req.user._id) {
    return res.status(401).send("Access to activities of another user denied.");
  }
  await activity.remove();

  res.send(activity);
});

module.exports = router;
