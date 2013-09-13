"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var StarredProjects = require('../tags/starredProjects');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var ctrl = units.require('project.controller');
	var env = units.require('core.template');
	env.addExtension('StarredProjects', new StarredProjects(env, ctrl));
};


module.exports = Tags;