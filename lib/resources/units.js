"use strict";
var UnitSet = require('units').UnitSet;

var postUnits = require('./post/units');
var contentUnits = require('./content/units');
var Tags = require('./tags');

var create = function () {
	var units = postUnits.create();
	units.addSet('content', contentUnits.create());
	units.add('tag', new Tags());

	return units;
};


module.exports = {
	create: create
};
