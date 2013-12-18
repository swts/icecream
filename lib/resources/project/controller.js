"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');

var Project = function () {
	this.db = null;
	this.boxName = "projects";
};
inherits(Project, Unit);

Project.prototype.unitInit = function (units) {
	this.db = units.require('db');
	this.box = this.db.getBox(this.boxName);
};

Project.prototype.get = function(auth, slug, cb) {
	var self = this;

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
};

Project.prototype.getByCategory = function(auth, slug, cb) {
	var self = this;

	var filter;

	if (slug !== "all" && slug !== undefined) {
		filter = self.db.r.row('categories').contains(slug);

		if (auth === null) {
			filter = filter.and(self.db.r.row('status').eq("published"));
		}
	} else {
		if (auth === null) {
			filter = self.db.r.row('status').eq("published");
		}
	}
		self.db.joinTree({
			box: self.boxName,
			filter: filter
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
			result.toArray(function(err, result) {
				cb(err, result);
			});
		});
};

Project.prototype.create = function (project, cb) {
	var self = this;

	this.db.create(this.boxName, project, cb);
};

Project.prototype.update = function (slug, to, cb) {
	var self = this;

	this.db.update(this.boxName, slug, to, cb);
};

Project.prototype.remove = function (slug, cb) {
	var self = this;

	this.db.remove(this.boxName, slug, cb);
};

Project.prototype.createItem = function (item, cb) {
	var path = this.db.getPath(item.slug);

	delete item.slug;
	this.db.create(this.boxName, path, item, cb);
};

Project.prototype.updateItem = function (item, data, cb) {
	var path = this.db.getPath(item);
	this.db.update(this.boxName, path, data, cb);
};

Project.prototype.renameItem = function(item, newName, cb) {
	var path = this.db.getPath(item);
	this.db.rename(this.boxName, path, newName, cb);
};

Project.prototype.removeItem = function (item, cb) {
	var path = this.db.getPath(item);
	this.db.remove(this.boxName, path, cb);
};

module.exports = Project;
