'use strict';
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var v = require('../validators');

var Request = function () {};
inherits(Request, Unit);

Request.prototype.unitInit = function(units) {
	this.node = units.require("resources.node.request");
};

Request.prototype.create = function() {
	return {
		id: v.slug,
		index: v.opt(v.idx),
		node: this.node.create()
	};
};

Request.prototype.update = function() {
	var validator = this.node.update();
	validator.id = v.path;
	return validator;
};

Request.prototype.del = function() {
	return {
		id: v.path
	};
};


module.exports = Request;
