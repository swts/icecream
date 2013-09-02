"use strict";

/*
	project: {
		slug: "",
		title: "",
		category: "",
		date: timestamp,
		content: [
			{
				type: "",
				data: ""
			}
		],

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

		publish_date: opt(v.date),
		status: v.str
	},

	update: {
		slug: v.slug,
		title: v.str,
		category: v.str,
		date: v.date,
		content: v.opt(v.arr()),

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

Project.prototype.get = function (auth, item, cb) {
	this.ctrl.get(item.slug, cb);
};

Project.prototype.create = function (auth, item, cb) {
	this.ctrl.create(item, cb);
};

Project.prototype.update = function (auth, item, cb) {
	this.ctrl.update(item.slug, item.to, cb);
};

Project.prototype.del = function (auth, item, cb) {
	this.ctrl.remove(item.slug, cb);
};


module.exports = Project;
