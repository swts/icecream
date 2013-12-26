"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');

var Project = function () {
	this.db = null;
	this.box = "projects";
};
inherits(Project, Unit);

Project.prototype.unitInit = function (units) {
	this.db = units.require('db');
};

Project.prototype.get = function(auth, slug, cb) {
	var self = this;

	self.db.joinTree({
		box: this.box,
		get: slug,
		index: "slug"
	}, {
		to: "categories",
		from: "trees",
		fromSlug: "categories",
		fromProperty: "items"
	}, [{
		nth: 0
	}], function(err, data) {
		if (auth === null && data.status !== "published") {
			cb("BAD REQUEST");
		} else {
			cb(err, data);
		}
	});
};

Project.prototype.getByCategory = function(auth, slug, cb) {
	var self = this;

	var filter;

	if (slug !== "all" && slug !== undefined) {
		filter = function(row) {
			return row('categories').contains(slug);
		};

		if (auth === null) {
			filter = function(row) {
				return row('categories').contains(slug).and(row('status').eq("published"));
			};
		}
	} else {
		if (auth === null) {
			filter = function(row) {
				return row('status').eq("published");
			};
		}
	}
		self.db.joinTree({
			box: this.box,
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
	this.db.create(this.box, project, cb);
};

Project.prototype.update = function (slug, to, cb) {
	this.db.update(this.box, slug, to, cb);
};

Project.prototype.remove = function (slug, cb) {
	this.db.remove(this.box, slug, cb);
};

Project.prototype.createItem = function (item, cb) {
	var path = this.db.getPath(item.slug, "items");

	delete item.slug;
	this.db.create(this.box, path, item, cb);
};

Project.prototype.updateItem = function (item, data, cb) {
	var path = this.db.getPath(item, "items");
	this.db.update(this.box, path, data, cb);
};

Project.prototype.renameItem = function(item, newName, cb) {
	var path = this.db.getPath(item, "items");
	this.db.rename(this.box, path, newName, cb);
};

Project.prototype.removeItem = function (item, cb) {
	var path = this.db.getPath(item, "items");
	this.db.remove(this.box, path, cb);
};

module.exports = Project;
