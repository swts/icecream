"use strict";
var UnitSet = require('units').UnitSet;

var project = require('./project/units'); 
var Tags = require('./tags');

var create = function () {
	var units = new UnitSet();

	units.addSet('project', project.create());
	units.add('tag', new Tags());

	return units;
};


module.exports = {
	create: create
};