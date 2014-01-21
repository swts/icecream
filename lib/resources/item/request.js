'use strict';
var v = require('../validators');

module.exports = {
	create: function(settings) {
		var languages = settings.languages,
			validator = v.basedOn(v.ProjectItem, {
				slug: v.path
			});

		if (languages) {
		validator = v.basedOn({
			type: v.oneOf("text", "headline", "image", "embedded"),
			content: v.or({
				"html": v.str,
				"title": v.translate(v.EmbeddedContent.title, languages)
			}, v.translate(v.TextContent, languages), v.translate(v.HeadlineContent, languages), v.ImageContent)
		}, {
			slug: v.path
		});
	}

		return validator;
	},

	update: function(settings) {
		var languages = settings.languages,
			validator = {
				slug: v.path,
				to: {
					type: v.opt(v.oneOf("text", "headline", "image", "embedded")),
					content: v.opt(v.or(v.EmbeddedContent, v.TextContent, v.HeadlineContent, v.ImageContent))
				}
			};

		if (languages) {
			validator.to = {
				type: v.opt(v.oneOf("text", "headline", "image", "embedded")),
				content: v.opt(v.or({
					"html": v.opt(v.str),
					"title": v.translate(v.opt(v.EmbeddedContent.title), languages)
				}, v.translate(v.TextContent, languages), v.translate(v.HeadlineContent, languages), v.ImageContent))
			};
		}
			
		return validator;
	},

	del: function(settings) {
		return {
			slug: v.path
		};
	}
};
