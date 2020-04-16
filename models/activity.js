const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const mongoose = require("mongoose");

const Activity = mongoose.model(
  "Activity",
  new mongoose.Schema({
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      minlength: 1,
      required: true,
    },
    preferredInterval: new mongoose.Schema({
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    }),
    expectedDuration: {
      type: Number,
      min: 0,
      max: 840,
      required: true,
    },
    description: {
      type: String,
    },
  })
);

function validateActivity(activity) {
  const schema = Joi.object({
    ownerId: Joi.objectId().required(),
    name: Joi.string().min(1).required(),
    preferredInterval: Joi.object({
      _id: Joi.objectId(),
      start: Joi.date().format("HH:mm:ssZ").required(),
      end: Joi.date().format("HH:mm:ssZ").required().greater(Joi.ref("start")),
    }).required(),
    expectedDuration: Joi.number().min(0).max(840).required(),
    description: Joi.string(),
  });

  return schema.validate(activity);
}

exports.Activity = Activity;
exports.validate = validateActivity;
