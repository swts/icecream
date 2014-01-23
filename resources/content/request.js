'use strict';
var v = require('../validators');

module.exports = {
	create: function(settings) {
		var languages = settings.languages,
			validator;

		if (languages) {
			validator = v.translateContent(languages);
		} else {
			validator = v.content;
		}

		v.basedOn(validator, {slug: v.path});
		return validator;
	},

	update: function(settings) {
		var languages = settings.languages,
			validator = {slug: v.path},
			content;

		if (languages) {
			content = v.translateContent(languages);
		} else {
			content = v.content;
		}

		validator.to = {
			type: v.opt(content.type),
			content: v.opt(content.content)
		};

		return validator;
	},

	del: function(settings) {
		return {
			slug: v.path
		};
	}
};
