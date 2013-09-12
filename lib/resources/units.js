"use strict";
var UnitSet = require('units').UnitSet;

var project = require('./project/units');
var item = require('./item/units');

var create = function () {
	var units = project.create();
	units.addSet('item', item.create());

	return units;
};


module.exports = {
	create: create
};
