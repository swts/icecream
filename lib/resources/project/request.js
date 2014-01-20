'use strict';
var v = require('../validators');

module.exports = {
	get: function(settings) {
		return {
			slug: v.opt(v.slug),
			category: v.opt(v.path)
		};
	},

	create: function(settings) {
		var languages = settings.languages,
			validator = {
				"slug": v.slug,
				"title": v.str,
				"categories": [v.path],
				"date": v.posInt,
				"order": [v.slug],
				"items": v.dict(v.slug, v.ProjectItem),
				"preview": v.str,
				"publish_date": v.posInt,
				"status": v.str
			};

		if (languages) {
			validator.title = v.translate(validator.title, languages);
			validator.items = v.dict(v.slug, {
				type: v.oneOf("text", "headline", "image", "embedded"),
				content: v.or({
					"html": v.str,
					"title": v.translate(v.EmbeddedContent.title, languages)
				}, v.translate(v.TextContent, languages), v.translate(v.HeadlineContent, languages), v.ImageContent)
			});
		}

		return validator;
	},

	update: function(settings) {
		var languages = settings.languages,
			validator = {
				slug: v.slug,
				to: {
					"slug": v.opt(v.slug),
					"title": v.opt(v.str),
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
			validator.to.title = v.translate(validator.to.title, languages);
		}
			
		return validator;
	},

	del: function(settings) {
		return {
			slug: v.slug
		};
	}
};
