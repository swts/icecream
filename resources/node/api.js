"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var returnHandler = require('apis-return').handler;

var Node = function () {};
inherits(Node, Unit);

Node.prototype.resource = 'post/node';

Node.prototype.unitInit = function (units) {
	this.ctrl = units.require('post.controller');
};

Node.prototype.create = function (auth, data, cb) {
	this.ctrl.createNode(data.slug, data.index, data.node, returnHandler("BadRequest", cb));
};

Node.prototype.update = function (auth, data, cb) {
	var id = data.slug.split('/');
	this.ctrl.updateNode(id[1], data.to, returnHandler("BadRequest", cb));
};

Node.prototype.del = function (auth, data, cb) {
	var id = data.slug.split('/');
	this.ctrl.removeNode(id[0], id[1], returnHandler("NotFound", cb));
};


module.exports = Node;
