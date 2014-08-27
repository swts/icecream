'use strict';
var v = require('../validators');

var Request = function () {};

Request.prototype.unitInit = function(units) {
	this.node = units.require("resources.node.request");
	this.languages = units.require("core.settings").languages;
};

Request.prototype.get = function() {
	return v.or(
		{id: v.slug},
		{
			category: v.path,
			created: v.opt(v.posInt),
			published: v.opt(v.posInt),
			limit: v.opt(v.idx),
			withContent: v.opt(v.bool)
		},
		{
			categories: [v.path],
			created: v.opt(v.posInt),
			published: v.opt(v.posInt),
			limit: v.opt(v.posInt),
			withContent: v.opt(v.bool)
		}
	);
};

Request.prototype.create = function() {
	var validator = {
			slug: v.slug,
			categories: v.opt([v.path]),
			preview: v.opt(v.str),
			published: v.opt(v.posInt),
			nodes: v.opt([v.str]),
			content: v.opt([this.node.create()]),
			status: v.opt(v.status)
		};

	if (this.languages) {
		validator.title = v.translate(v.str, this.languages);
	} else {
		validator.title = v.str;
	}

	return validator;
};

Request.prototype.update = function() {
	var validator = {
			id: v.slug,
			to: {
				slug: v.opt(v.slug),
				categories: v.opt([v.path]),
				date: v.opt(v.posInt),
				preview: v.opt(v.str),
				published: v.opt(v.posInt),
				scheme: v.opt(v.str),
				nodes: v.opt([v.str]),
				status: v.opt(v.status)
			}
		};

	if (this.languages) {
		validator.to.title = v.translate(v.opt(v.str), this.languages);
	} else {
		validator.to.title = v.opt(v.str);
	}

	return validator;
};

Request.prototype.del = function() {
	return {
		id: v.slug
	};
};

module.exports = Request;
