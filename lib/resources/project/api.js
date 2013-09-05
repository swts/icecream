"use strict";

var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;

var v = require('../validators');
var dbErrHandler = require('sweets-nougat').dbErrHandler;

var Project = function () {};
inherits(Project, Unit);

Project.prototype.name = 'projects/project';

Project.prototype.method = {
	get: {
		project: v.opt(v.slug),
		category: v.opt(v.slug)
	},

	create: {
		slug: v.slug,
		title: v.opt(v.any),
		mainCategory: v.opt(v.any),
		category: v.opt(v.any),
		date: v.opt(v.any),
		content: [
			{
				type: v.str,
				content: v.opt(v.any)
			}
		],
		preview: v.str,
		
		publish_date: v.opt(v.any),
		status: v.opt(v.any)
	},

	update: {
		slug: v.slug,
		title: v.opt(v.any),
		mainCategory: v.opt(v.any),
		category: v.opt(v.any),
		date: v.opt(v.any),
		content: [
			{
				type: v.str,
				content: v.opt(v.any)
			}
		],
		preview: v.str,
		
		publish_date: v.opt(v.any),
		status: v.opt(v.any)
	},

	del: {
		slug: v.slug
	}
};

Project.prototype.unitInit = function (units) {
	this.ctrl = units.require('resources.projects.project.controller');
};

Project.prototype.get = function (auth, data, cb) {
	if (data.project) {
		this.ctrl.getProjectByName(data.project, cb);
	} else if (data.category) {
		this.ctrl.getProjectByCategory(data.category, cb);
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
