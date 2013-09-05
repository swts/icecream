"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');
var categoryOrder = ["public", "living", "private", "landscape", "interior"];
var subOrder = ["ipublic", "ioffice", "irest", "iliving"];

var Category = function () {
	this.db = null;
	this.cache = null;
};
inherits(Category, Unit);

Category.prototype.unitInit = function (units) {
	var cache = units.get('core.cache').cache('categories');
	this.cache = new Uch(cache);
	this.db = units.require('db');
	this.box = this.db.getBox('categories');
};

Category.prototype.parseSlug = function(slug) {
	return slug.split('.');
};

Category.prototype.get = function(cb) {
	var self = this;
	this.cache.check("menu-category", cb, function() {
		self.db.getConnection(function(conn) {
			self.box
				.run(conn, function(err, result) {
					result.toArray(self.cache.add("menu-category", cb));
				});
		}, cb);
	});
};

Category.prototype.create = function (category, cb) {
	var self = this;

	this.db.getConnection(function(conn) {
		self.box
			.insert(project)
			.run(conn, self.cache.add(project.slug, cb));
	}, cb);
};

Category.prototype.update = function (slug, to, cb) {
	var self = this;

	this.db.getConnection(function(conn) {
		self.box
			.get(slug)
			.update(to)
			.run(conn, self.cache.remove(slug, cb));
	}, cb);
};

Category.prototype.remove = function (slug, cb) {
	var self = this;

	this.db.getConnection(function(conn) {
		self.box
			.get(slug)
			.delete()
			.run(conn, self.cache.remove(slug, cb));
	}, cb);
};


module.exports = Category;
