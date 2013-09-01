"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var ProjectTag = require('../tags/menu');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var ctrl = units.require('item.controller');
	var env = units.require('core.template');
	env.addExtension('Icecream', new ProjectTag(env, ctrl));
};


module.exports = Tags;
