const { Settings } = require("luxon");

module.exports = function() {
  Settings.defaultZoneName = "utc";
};
