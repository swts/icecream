'use strict';
var v = require('../validators');

module.exports = {
	get: function(settings) {
		return v.or(
			{slug: v.slug},
			{
				category: v.path,
				withContent: v.opt(v.bool)
			},
			{
				categories: [v.path],
				withContent: v.opt(v.bool)
			}
		);
	},

	create: function(settings) {
		var languages = settings.languages,
			validator = {
				"slug": v.slug,
				"categories": [v.path],
				"date": v.posInt,
				"preview": v.str,
				"publish_date": v.posInt,
				"nodes": v.opt([v.str]),
				"status": v.status
			};

		if (languages) {
			validator.title = v.translate(v.str, languages);
		} else {
			validator.title = v.str;
		}

		return validator;
	},

	update: function(settings) {
		var languages = settings.languages,
			validator = {
				slug: v.slug,
				to: {
					"slug": v.opt(v.slug),
					"categories": v.opt([v.path]),
					"date": v.opt(v.posInt),
					"preview": v.opt(v.str),
					"publish_date": v.opt(v.posInt),
					"scheme": v.opt(v.str),
					"nodes": v.opt([v.str]),
					"status": v.opt(v.status)
				}
			};

		if (languages) {
			validator.to.title = v.translate(v.opt(v.str), languages);
		} else {
			validator.to.title = v.opt(v.str);
		}

		return validator;
	},

	del: function(settings) {
		return {
			slug: v.slug
		};
	}
};
