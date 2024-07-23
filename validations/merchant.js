const Joi = require('joi');
module.exports = {
	merchantValidation: Joi.object({
		domain: Joi.string().domain().require()
	})
};
