const Joi = require('joi');

const validateInput = (schema, property) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      const valid = error == null;

      if (valid) {
        return next();
      }
      const { details } = error;
      const message = details
        .map((i) => i.message)
        .toString()
        .replace(/"/g, '');

      return res.status(422).json({ message });
    } catch (e) {
      console.error('Validate error --->:', e);
    }
  };
};
module.exports = validateInput;
