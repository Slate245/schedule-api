const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

const { User } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Неверный email или пароль");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Неверный email или пароль");

  const token = user.generateAuthToken();
  res.send(token);
});

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  });

  return schema.validate(user);
}

module.exports = router;
