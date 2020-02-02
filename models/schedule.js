const mongoose = require("mongoose");

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
          allocatedTimeslot: new mongoose.Schema({
            begining: {
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
      default: []
    }
  })
);

exports.Schedule = Schedule;
