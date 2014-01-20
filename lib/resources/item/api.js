"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;

var Item = function () {};
inherits(Item, Unit);

Item.prototype.name = 'project/item';

Item.prototype.unitInit = function (units) {
	this.ctrl = units.require('project.controller');
};

Item.prototype.create = function (auth, data, cb) {
	this.ctrl.createItem(data, cb);
};

Item.prototype.update = function (auth, data, cb) {
	if(data.to.slug) {
		this.ctrl.renameItem(data.slug, data.to.slug, cb);
	} else {
		this.ctrl.updateItem(data.slug, data.to, cb);
	}
};

Item.prototype.del = function (auth, data, cb) {
	this.ctrl.removeItem(data.slug, cb);
};


module.exports = Item;
