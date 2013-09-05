"use strict";

var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;

var v = require('../validators');
var dbErrHandler = require('sweets-nougat').dbErrHandler;

var Category = function () {};
inherits(Category, Unit);

Category.prototype.name = 'projects/category';

Category.prototype.method = {
	get: null,

	create: {
		slug: v.slug,
		title: v.opt(v.any),
		parent: v.opt(v.any)
	},

	update: {
		slug: v.slug,
		title: v.opt(v.any),
		parent: v.opt(v.any)
	},

	del: {
		slug: v.slug
	}
};

Category.prototype.unitInit = function (units) {
	this.ctrl = units.require('resources.projects.category.controller');
};

Category.prototype.get = function (auth, data, cb) {
	this.ctrl.get(cb);
};

Category.prototype.create = function (auth, category, cb) {
	this.ctrl.create(category, cb);
};

Category.prototype.update = function (auth, category, cb) {
	this.ctrl.update(category.slug, category.to, cb);
};

Category.prototype.del = function (auth, category, cb) {
	this.ctrl.remove(category.slug, cb);
};


module.exports = Category;
