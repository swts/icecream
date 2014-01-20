"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;

var Project = function () {};
inherits(Project, Unit);

Project.prototype.name = 'project';

Project.prototype.unitInit = function (units) {
	this.ctrl = units.require('controller');
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
