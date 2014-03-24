"use strict";
var UnitSet = require('units').UnitSet;

var postUnits = require('./resources/post/units');
var nodeUnits = require('./resources/node/units');
var Tags = require('./tags');

var create = function () {
	var units = new UnitSet();

	units.addSet("post", postUnits.create());
	units.addSet('node', nodeUnits.create());
	units.add('tag', new Tags());

	return units;
};

module.exports = {
	create: create
};

