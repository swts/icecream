"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');
var markdown = require('markdown').markdown;

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

	this.categoryBox = units.require('resources.tree.controller').box;
};

Project.prototype.getPath = function(slug) {
	var result = [],
		path = slug.split('.');

	for(var i = 0; i < path.length; i++) {
		if(i!==0) {
			result.push('items');
		}
		result.push(path[i]);
	}

	return {
		root: result[0],
		path: result.join('.')
	};
};

Project.prototype.convertRawText = function(items) {
	if (items) {
		for (var i in items) {
			var item = items[i];
			if (item.type == "text") {
				item.content.html = {};
				item.content.html.en = markdown.toHTML(item.content.raw.en);
				item.content.html.ru = markdown.toHTML(item.content.raw.ru);
			}
		}
	}
}

Project.prototype.getProjectByName = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			self.box
				.filter({slug: slug})
				.map(function(project) {
					return project.merge({
							mainCategory: {
								slug: project("mainCategory"),
								obj: self.categoryBox.getAll('categories', {index: 'slug'}).nth(0)("items")(project("mainCategory"))
						}
					});
				})
				.nth(0)
				.run(conn, self.cache.add(slug, function(err, result) {
						cb(err, result);
						self.db.releaseConnection(conn);
					})
				);
		}, cb);
	});
};

Project.prototype.getProjectByCategory = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			var expr = self.box;

			if (slug !== "all") {
				expr = expr.filter(self.db.r.row('categories').contains(slug));
			}
			expr.map(function(project) {
    				return project.merge({
      					mainCategory: {
      						slug: project("mainCategory"),
      						obj: self.categoryBox.getAll('categories', {index: 'slug'}).nth(0)("items")(project("mainCategory"))
        				}
        			})
				})
				.orderBy(self.db.r.desc('date'))
				.without(['items'])
				.run(conn, function(err, result) {
					result.toArray(self.cache.add(slug, function(err, result) {
						cb(err, result);
						self.db.releaseConnection(conn);
					}));
				});				
		}, cb);
	});
};

Project.prototype.getStarredProjects = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			self.box
				.filter({starred: true})
				.map(function(project) {
					return project.merge({
							mainCategory: {
								slug: project("mainCategory"),
								obj: self.categoryBox.getAll('categories', {index: 'slug'}).nth(0)("items")(project("mainCategory"))
						}
					});
				})
				.orderBy(self.db.r.desc('date'))
				.without(['items'])
				.run(conn, function(err, result) {
					result.toArray(self.cache.add(slug, function(err, result) {
						cb(err, result);
						self.db.releaseConnection(conn);
					}));
				});
		}, cb);
	});
};

Project.prototype.create = function (project, cb) {
	var self = this;

	this.convertRawText(project.items);
	this.db.create(this.boxName, project, cb);
};

Project.prototype.update = function (slug, to, cb) {
	var self = this;

	this.convertRawText(to.items);
	this.db.update(this.boxName, slug, to, this.cache.remove(slug, cb));
};

Project.prototype.remove = function (slug, cb) {
	var self = this;

	this.db.remove(this.boxName, slug, this.cache.remove(slug, cb));
};

Project.prototype.createItem = function (item, cb) {
	var path = this.getPath(item.slug);

	delete item.slug;
	this.db.create(this.boxName, path.path, item, cb);
};

Project.prototype.updateItem = function (item, data, cb) {
	var path = this.getPath(item);
	this.db.update(this.boxName, path.path, data, this.cache.remove(path.root, cb));
};

Project.prototype.renameItem = function(item, newName, cb) {
	var path = this.getPath(item);
	this.db.rename(this.boxName, path.path, newName, this.cache.remove(path.root, cb));
};

Project.prototype.removeItem = function (item, cb) {
	var path = this.getPath(item);
	this.db.remove(this.boxName, path.path, this.cache.remove(path.root, cb));
};

module.exports = Project;
