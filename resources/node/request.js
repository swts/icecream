"use strict";
let v = require("../validators");

let Request = function () {};

Request.prototype.unitInit = function(units) {
	this.node = units.require("resources.node.request");
};

Request.prototype.create = function() {
	let validator = this.node.create();
	validator.id = v.slug;
	validator.index = v.opt(v.idx);
	return validator;
};

Request.prototype.update = function() {
	let validator = this.node.update();
	validator.id = v.path;
	return validator;
};

Request.prototype.del = function() {
	return {
		id: v.path
	};
};


module.exports = Request;
