"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var methods = require('./methods');

var Project = function () {};
inherits(Project, Unit);

Project.prototype.name = 'project';

Project.prototype.methods = methods;

Project.prototype.unitInit = function (units) {
	this.ctrl = units.require('controller');
};

Project.prototype.get = function (auth, data, cb) {
	if (data.project) {
		this.ctrl.get(data.project, cb);
	} else if (data.category) {
		this.ctrl.getByCategory(data.category, cb);
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
