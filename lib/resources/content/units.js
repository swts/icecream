"use strict";
var UnitSet = require('units').UnitSet;

var Api = require('./api');
var request = require('./request');
var roles = require('./roles');

var create = function () {
	var units = new UnitSet();

	units.add('api', new Api());
	units.expose('request', request);
	units.expose('roles', roles);

	return units;
};


module.exports = {
	create: create
};