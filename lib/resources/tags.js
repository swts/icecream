"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var ProjectMenu = require('../tags/projectMenu');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var ctrl = units.require('category.controller');
	var env = units.require('core.template');
	env.addExtension('ProjectMenu', new ProjectMenu(env, ctrl));
};


module.exports = Tags;
