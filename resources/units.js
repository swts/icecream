"use strict";
var postUnits = require('./post/units');
var nodeUnits = require('./node/units');
var Tags = require('./tags');

var create = function () {
	var units = postUnits.create();
	units.addSet('node', nodeUnits.create());
	units.add('tag', new Tags());

	return units;
};


module.exports = {
	create: create
};
