"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var returnHandler = require('apis-return').handler;

var Item = function () {};
inherits(Item, Unit);

Item.prototype.name = 'project/item';

Item.prototype.unitInit = function (units) {
	this.ctrl = units.require('project.controller');
};

Item.prototype.create = function (auth, data, cb) {
	this.ctrl.createItem(data, returnHandler("BadRequest", cb));
};

Item.prototype.update = function (auth, data, cb) {
	if(data.to.slug) {
		this.ctrl.renameItem(data.slug, data.to.slug, returnHandler("BadRequest", cb));
	} else {
		this.ctrl.updateItem(data.slug, data.to, returnHandler("BadRequest", cb));
	}
};

Item.prototype.del = function (auth, data, cb) {
	this.ctrl.removeItem(data.slug, returnHandler("NotFound", cb));
};


module.exports = Item;
