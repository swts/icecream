"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var Posts = require('../tags/posts');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var ctrl = units.require('post.controller');
	var env = units.require('core.template');
	env.addExtension('Posts', new Posts(env, ctrl));
};


module.exports = Tags;
