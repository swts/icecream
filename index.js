"use strict";
var UnitSet = require('units').UnitSet;

var postUnits = require('./resources/post/units');
var nodeUnits = require('./resources/node/units');
var Tags = require('./tags');

var create = function () {
	var units = new UnitSet();

	units.addSet('post', postUnits.create());
	units.addSet('post.node', nodeUnits.create());
	units.add('post.tags', new Tags());

	return units;
};

module.exports = {
	create: create
};

