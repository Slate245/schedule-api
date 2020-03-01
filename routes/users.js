const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validate } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .send("Пользователь с таким email уже зарегистрирован");

  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("Authorization", `Bearer ${token}`)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
