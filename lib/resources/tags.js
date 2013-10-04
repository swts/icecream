"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var Projects = require('../tags/projects');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var ctrl = units.require('project.controller');
	var env = units.require('core.template');
	env.addExtension('Projects', new Projects(env, ctrl));
};


module.exports = Tags;