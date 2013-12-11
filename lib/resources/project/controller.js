"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');

var Project = function () {
	this.db = null;
	this.cache = null;
	this.boxName = "projects";
};
inherits(Project, Unit);

Project.prototype.unitInit = function (units) {
	var cache = units.get('core.cache').cache('projects');
	this.cache = new Uch(cache);
	this.db = units.require('db');
	this.box = this.db.getBox(this.boxName);

	this.categoryBox = this.db.r.table(units.require('resources.tree.controller').box);
};

Project.prototype.get = function(auth, slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.joinTree({
			box: self.boxName,
			get: slug,
			index: "slug"
		}, {
			to: "categories",
			from: "trees",
			fromSlug: "categories",
			fromProperty: "items"
		}, [{
			nth: 0
		}], cb);
	});
};

Project.prototype.getByCategory = function(auth, slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.joinTree({
			box: self.boxName,
			filter: slug !== "all" && slug !== undefined ? self.db.r.row('categories').contains(slug) && (auth === null ? self.db.r.row('status').eq("published") : true) : auth === null ? self.db.r.row('status').eq("published") : undefined
		}, {
			to: "categories",
			from: "trees",
			fromSlug: "categories",
			fromProperty: "items"
		}, [{
			orderBy: self.db.r.desc('date')
		}, {
			without: ['items']
		}], function(err, result) {
			result.toArray(self.cache.add(slug, function(err, result) {
				cb(err, result);
			}));
		});
	});
};

Project.prototype.create = function (project, cb) {
	var self = this;

	this.db.create(this.boxName, project, cb);
};

Project.prototype.update = function (slug, to, cb) {
	var self = this;

	this.db.update(this.boxName, slug, to, this.cache.remove(slug, cb));
};

Project.prototype.remove = function (slug, cb) {
	var self = this;

	this.db.remove(this.boxName, slug, this.cache.remove(slug, cb));
};

Project.prototype.createItem = function (item, cb) {
	var path = this.db.getPath(item.slug);

	delete item.slug;
	this.db.create(this.boxName, path, item, cb);
};

Project.prototype.updateItem = function (item, data, cb) {
	var path = this.db.getPath(item);
	this.db.update(this.boxName, path, data, this.cache.remove(path[0], cb));
};

Project.prototype.renameItem = function(item, newName, cb) {
	var path = this.db.getPath(item);
	this.db.rename(this.boxName, path, newName, this.cache.remove(path[0], cb));
};

Project.prototype.removeItem = function (item, cb) {
	var path = this.db.getPath(item);
	this.db.remove(this.boxName, path, this.cache.remove(path[0], cb));
};

module.exports = Project;
