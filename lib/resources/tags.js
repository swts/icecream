"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var Project = require('../tags/project');
var ProjectMenu = require('../tags/projectMenu');
var ProjectList = require('../tags/projectList');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var ctrl = units.require('project.controller');
	var env = units.require('core.template');
	env.addExtension('Project', new Project(env, ctrl));
	env.addExtension('ProjectMenu', new ProjectMenu(env, ctrl));
	env.addExtension('ProjectList', new ProjectList(env, ctrl));
};


module.exports = Tags;
