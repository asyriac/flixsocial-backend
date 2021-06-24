const Joi = require("joi");

const postValidationSchema = Joi.object({
  content: Joi.string().required(),
});

module.exports = { postValidationSchema };
