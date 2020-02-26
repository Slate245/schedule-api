const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

function validateActivityDates(activities) {
  let result = true;

  activities.forEach(a => {
    const date = DateTime.fromJSDate(this.date).toISODate();
    const start = DateTime.fromJSDate(a.allocatedInterval.start).toISODate();
    const end = DateTime.fromJSDate(a.allocatedInterval.end).toISODate();

    if (date !== start || date !== end) {
      result = false;
    }
  });
  return result;
}

const Schedule = mongoose.model(
  "Schedule",
  new mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    workingHours: {
      type: [Date],
      required: true
    },
    plannedActivities: {
      type: [
        new mongoose.Schema({
          name: {
            type: String,
            required: true
          },
          allocatedInterval: new mongoose.Schema({
            start: {
              type: Date,
              required: true
            },
            end: {
              type: Date,
              required: true
            }
          })
        })
      ],
      default: [],
      validate: [
        validateActivityDates,
        "Dates of activities do not match the date of the schedule"
      ]
    }
  })
);

function validateSchedule(schedule) {
  const plannedActivitySchema = Joi.object({
    _id: Joi.objectId(),
    name: Joi.string()
      .max(150)
      .required(),
    allocatedInterval: Joi.object({
      _id: Joi.objectId(),
      start: Joi.date().required(),
      end: Joi.date()
        .required()
        .greater(Joi.ref("start"))
    }).required()
  });
  const schema = Joi.object({
    _id: Joi.objectId(),
    date: Joi.date().required(),
    workingHours: Joi.array()
      .items(Joi.date())
      .min(1)
      .required(),
    plannedActivities: Joi.array()
      .items(plannedActivitySchema)
      .required(),
    __v: Joi.number()
  });

  return schema.validate(schedule);
}

exports.Schedule = Schedule;
exports.validate = validateSchedule;
