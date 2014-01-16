"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var v = require('../validators');
var methods = require('./methods');

var Project = function () {};
inherits(Project, Unit);

Project.prototype.name = 'project';

Project.prototype.methods = methods;

Project.prototype.unitInit = function (units) {
	this.ctrl = units.require('controller');

	var languages = units.require('core.settings').languages;

	if (languages) {
		methods.create.title = v.translate(methods.create.title, languages);
		methods.update.to.title = v.translate(v.opt(v.str), languages);
		methods.create.items = v.dict(v.slug, {
			type: v.oneOf("text", "headline", "image", "embedded"),
			content: v.or({
				"html": v.str,
				"title": v.translate(v.EmbeddedContent.title, languages)
			}, v.translate(v.TextContent, languages), v.translate(v.HeadlineContent, languages), v.ImageContent)
		});
	}
};

Project.prototype.get = function (auth, data, cb) {
	if (data.slug) {
		this.ctrl.get(auth, data.slug, cb);
	} else if (data.category) {
		this.ctrl.getByCategory(auth, data.category, cb);
	}
};

Project.prototype.create = function (auth, project, cb) {
	this.ctrl.create(project, cb);
};

Project.prototype.update = function (auth, project, cb) {
	this.ctrl.update(project.slug, project.to, cb);
};

Project.prototype.del = function (auth, project, cb) {
	this.ctrl.remove(project.slug, cb);
};


module.exports = Project;
