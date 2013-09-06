"use strict";
var UnitSet = require('units').UnitSet;

var project = require('./project/units');

var create = function () {
	var units = new UnitSet();

	units.addSet('project', project.create());

	return units;
};


module.exports = {
	create: create
};
