const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.use(auth);

module.exports = router;
