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
				"order": [v.slug],
				"preview": v.str,
				"publish_date": v.posInt,
				"status": v.str
			};

		if (languages) {
			validator.title = v.translate(v.str, languages);
			var content = v.translateContent(languages);
			validator.content = v.dict(v.slug, content);
		} else {
			validator.title = v.str;
			validator.content = v.dict(v.slug, v.content);
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
					"order": v.opt([v.slug]),
					"preview": v.opt(v.str),
					"publish_date": v.opt(v.posInt),
					"scheme": v.opt(v.str),
					"status": v.opt(v.str)
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
