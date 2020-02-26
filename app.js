require("dotenv").config();

const express = require("express");

process.on("unhandledRejection", ex => {
  throw ex;
});

const app = express();

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/time")();
require("./startup/db")();

const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;
