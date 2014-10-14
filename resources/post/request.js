'use strict';
var v = require('../validators');

var Request = function () {};

Request.prototype.unitInit = function(units) {
	this.node = units.require("resources.node.request");
};

Request.prototype.get = function() {
	var vDate = v.opt(v.or(
		v.posInt,
		[v.posInt]
	));

	return v.or(
		{id: v.slug},
		{
			category: v.path,
			created: vDate,
			published: vDate,
			limit: v.opt(v.idx),
			withContent: v.opt(v.bool)
		},
		{
			categories: [v.path],
			created: vDate,
			published: vDate,
			limit: v.opt(v.posInt),
			withContent: v.opt(v.bool)
		}
	);
};

Request.prototype.create = function() {
	return {
		slug: v.slug,
		title: v.str,
		categories: v.opt([v.path]),
		preview: v.opt(v.str),
		published: v.opt(v.posInt),
		nodes: v.opt([v.str]),
		content: v.opt([this.node.create()]),
		status: v.opt(v.status)
	};
};

Request.prototype.update = function() {
	return {
		id: v.slug,
		to: {
			slug: v.opt(v.slug),
			title: v.opt(v.str),
			categories: v.opt([v.path]),
			date: v.opt(v.posInt),
			preview: v.opt(v.str),
			published: v.opt(v.posInt),
			scheme: v.opt(v.str),
			nodes: v.opt([v.str]),
			status: v.opt(v.status)
		}
	};
};

Request.prototype.del = function() {
	return {
		id: v.slug
	};
};

module.exports = Request;
