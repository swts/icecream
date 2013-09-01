"use strict";
var UnitSet = require('units').UnitSet;

var Controller = require('./controller');
var Api = require('./api');

var create = function () {
	var units = new UnitSet();

	units.add('controller', new Controller());
	units.add('api', new Api());

	return units;
};


module.exports = {
	create: create
};
