"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var v = require('../validators');
var methods = require('./methods');

var Item = function () {};
inherits(Item, Unit);

Item.prototype.name = 'project/item';

Item.prototype.methods = methods;

Item.prototype.unitInit = function (units) {
	this.ctrl = units.require('project.controller');

	var languages = units.require('core.settings').languages;

	if (languages) {
		methods.create = v.basedOn({
			type: v.oneOf("text", "headline", "image", "embedded"),
			content: v.or({
				"html": v.str,
				"title": v.translate(v.EmbeddedContent.title, languages)
			}, v.translate(v.TextContent, languages), v.translate(v.HeadlineContent, languages), v.ImageContent)
		}, {
			slug: v.path
		});
		methods.update.to = {
			type: v.opt(v.oneOf("text", "headline", "image", "embedded")),
			content: v.opt(v.or({
				"html": v.opt(v.str),
				"title": v.translate(v.opt(v.EmbeddedContent.title), languages)
			}, v.translate(v.TextContent, languages), v.translate(v.HeadlineContent, languages), v.ImageContent))
		};
	}
};

Item.prototype.create = function (auth, data, cb) {
	this.ctrl.createItem(data, cb);
};

Item.prototype.update = function (auth, data, cb) {
	if(data.to.slug) {
		this.ctrl.renameItem(data.slug, data.to.slug, cb);
	} else {
		this.ctrl.updateItem(data.slug, data.to, cb);
	}
};

Item.prototype.del = function (auth, data, cb) {
	this.ctrl.removeItem(data.slug, cb);
};


module.exports = Item;
