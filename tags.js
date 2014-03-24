"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var Post = require('./tags/post');
var Posts = require('./tags/posts');

var Tags = function () {};
inherits(Tags, Unit);

Tags.prototype.unitInit = function (units) {
	var env = units.require('core.template');

	if(env && env.addExtension) {
		var ctrl = units.require('post.controller');
		env.addExtension('Post', new Post(env, ctrl));
		env.addExtension('Posts', new Posts(env, ctrl));
	}
};


module.exports = Tags;