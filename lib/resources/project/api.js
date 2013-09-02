"use strict";

/*
	project: {
		slug: "",
		title: "",
		category: "",
		date: timestamp,
		content: [
			{
				type: "title",
				data: {
					headline: "",
					subheadine: ""
				},

				type: "description",
				data: ["array of paragraphs"],
				
				type: "quote",
				data: "headline"
			}
		],
		preview: ""

		publish_date: timestamp,
		status: ""
	}
*/
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
		slug: v.slug
	},

	create: {
		slug: v.slug,
		title: v.str,
		category: v.str,
		date: opt(v.date),
		content: v.opt(v.arr()),
		preview: v.str,

		publish_date: opt(v.date),
		status: v.str
	},

	update: {
		slug: v.slug,
		title: v.str,
		category: v.str,
		date: v.date,
		content: v.opt(v.arr()),
		preview: v.str,

		publish_date: opt(v.date),
		status: v.str
	},

	del: {
		slug: v.slug
	}
};

Project.prototype.unitInit = function (units) {
	this.ctrl = units.require('resources.projects.project.controller');
};

Project.prototype.get = function (auth, project, cb) {
	this.ctrl.get(project.slug, cb);
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
