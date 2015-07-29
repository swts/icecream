"use strict";
let v = require("../validators");

let Request = function () {};

Request.prototype.unitInit = function(units) {
	this.node = units.require("resources.node.request");
};

Request.prototype.get = function() {
	let vDate = v.opt(v.or(
		v.posInt,
		[v.posInt]
	));

	return v.or(
		{id: v.uuid},
		{slug: v.slug},
		{
			category: v.opt(v.path),
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
	let nodeValid = this.node.create();

	return {
		slug: v.slug,
		title: v.opt(v.str),
		categories: v.opt([v.path]),
		preview: v.opt(nodeValid),
		published: v.opt(v.posInt),
		content: v.opt([nodeValid]),
		status: v.opt(v.status)
	};
};

Request.prototype.update = function() {
	let nodeValid = this.node.update();
	return {
		id: v.uuid,
		to: {
			slug: v.opt(v.slug),
			title: v.opt(v.str),
			categories: v.opt([v.path]),
			date: v.opt(v.posInt),
			preview: v.opt(nodeValid),
			published: v.opt(v.posInt),
			nodes: v.opt([v.uuid]),
			status: v.opt(v.status)
		}
	};
};

Request.prototype.del = function() {
	return {
		id: v.uuid
	};
};

module.exports = Request;
