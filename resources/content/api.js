"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var returnHandler = require('apis-return').handler;

var Content = function () {};
inherits(Content, Unit);

Content.prototype.name = 'post/content';

Content.prototype.unitInit = function (units) {
	this.ctrl = units.require('post.controller');
};

Content.prototype.create = function (auth, data, cb) {
	this.ctrl.createContent(data, returnHandler("BadRequest", cb));
};

Content.prototype.update = function (auth, data, cb) {
	this.ctrl.updateContent(data.id, data.to, returnHandler("BadRequest", cb));
};

Content.prototype.del = function (auth, data, cb) {
	console.log(data);
	this.ctrl.removeContent(data.slug, data.id, returnHandler("NotFound", cb));
};


module.exports = Content;
