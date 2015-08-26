"use strict";
var UnitSet = require("units").UnitSet;

var Controller = require("./controller");
var Api = require("./api");
var Request = require("./request");

module.exports = function () {
	var units = new UnitSet();

	units.add("controller", new Controller());
	units.add("api", new Api());
	units.add("request", new Request());

	return units;
};
