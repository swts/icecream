"use strict";
var UnitSet = require("units").UnitSet;

var post = require("./resources/post/units");
var node = require("./resources/node/units");
var Tags = require("./tags");


module.exports = function () {
	var units = new UnitSet();

	units.addSet("post", post());
	units.addSet("post.node", node());
	units.add("post.tags", new Tags());

	return units;
};
