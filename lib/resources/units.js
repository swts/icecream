"use strict";
var UnitSet = require('units').UnitSet;

var project = require('./project/units');
var item = require('./item/units');
var Tags = require('./tags');

var create = function () {
	var units = project.create();
	units.addSet('item', item.create());
	units.add('tag', new Tags());

	return units;
};


module.exports = {
	create: create
};
