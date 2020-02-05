const { set } = require("date-fns");
const { Schedule } = require("./models/schedule");

function populateWorkingHours(date) {
  const from = 8;
  const to = 21;
  const workingHours = [];
  for (let i = from; i <= to; i++) {
    workingHours.push(
      set(date, { hours: i, minutes: 0, seconds: 0, milliseconds: 0 })
    );
  }
  return workingHours;
}

module.exports = async function createSchedule() {
  const date = new Date("January 7 2020");
  const workingHours = populateWorkingHours(date);
  const schedule = new Schedule({
    date: date,
    workingHours,
    plannedActivities: [
      {
        name: "Первая встреча",
        allocatedTimeslot: {
          begining: set(date, {
            hours: 9,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
          }),
          end: set(date, { hours: 9, minutes: 45, seconds: 0, milliseconds: 0 })
        }
      },
      {
        name: "Вторая встреча",
        allocatedTimeslot: {
          begining: set(date, {
            hours: 10,
            minutes: 15,
            seconds: 0,
            milliseconds: 0
          }),
          end: set(date, {
            hours: 10,
            minutes: 30,
            seconds: 0,
            milliseconds: 0
          })
        }
      },
      {
        name: "Третья встреча",
        allocatedTimeslot: {
          begining: set(date, {
            hours: 11,
            minutes: 30,
            seconds: 0,
            milliseconds: 0
          }),
          end: set(date, {
            hours: 12,
            minutes: 45,
            seconds: 0,
            milliseconds: 0
          })
        }
      },
      {
        name: "Четвертая встреча",
        allocatedTimeslot: {
          begining: set(date, {
            hours: 14,
            minutes: 45,
            seconds: 0,
            milliseconds: 0
          }),
          end: set(date, {
            hours: 15,
            minutes: 30,
            seconds: 0,
            milliseconds: 0
          })
        }
      }
    ]
  });
  const result = await schedule.save();
  console.log(result);
};
