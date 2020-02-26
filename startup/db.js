const mongoose = require("mongoose");

module.exports = function() {
  mongoose
    .connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => console.log(`Connected to ${process.env.DB_STRING}...`))
    .catch(err => console.error("Could not connect to MongoDB...", err));
};
