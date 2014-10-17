"use strict";
var returnHandler = require('apis-return').handler;

var Node = function () {};

Node.prototype.resource = 'post/node';

Node.prototype.unitInit = function (units) {
	this.ctrl = units.require('post.controller');
};

Node.prototype.create = function (auth, data, cb) {
	var id = data.id,
		index = data.index;

	delete data.id;
	delete data.index;
	this.ctrl.createNode(id, index, data, returnHandler("BadRequest", cb));
};

Node.prototype.update = function (auth, data, cb) {
	var id = data.id.split('/');
	this.ctrl.updateNode(id[1], data.to, returnHandler("BadRequest", cb));
};

Node.prototype.del = function (auth, data, cb) {
	var id = data.id.split('/');
	this.ctrl.removeNode(id[0], id[1], returnHandler("NotFound", cb));
};


module.exports = Node;
