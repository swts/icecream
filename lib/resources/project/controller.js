"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');
var markdown = require('markdown').markdown;

var Project = function () {
	this.db = null;
	this.cache = null;
};
inherits(Project, Unit);

Project.prototype.unitInit = function (units) {
	var cache = units.get('core.cache').cache('projects');
	this.cache = new Uch(cache);
	this.db = units.require('db');
	this.box = this.db.getBox('projects');

	this.categoryBox = units.require('resources.tree.controller').box;
};

Project.prototype.parseSlug = function(slug) {
	return slug.split('.');
};

Project.prototype.convertRawText = function(block) {
	block.html = markdown.toHTML(block.raw);
};

Project.prototype.getProjectByName = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			self.box
				.map(function(project) {
					return project.merge({
							mainCategory: {
								slug: project("mainCategory"),
								obj: self.categoryBox.getAll('categories', {index: 'slug'}).nth(0)("items")(project("mainCategory"))
						}
					});
				})
				.filter({slug: slug})
				.run(conn, function(err, result) {
						result.toArray(self.cache.add(slug, cb));
					});
		}, cb);
	});
};

Project.prototype.getProjectByCategory = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			console.log(slug);
			if (slug === "all") {
				self.box
					.map(function(project) {
						return project.merge({
								mainCategory: {
									slug: project("mainCategory"),
									obj: self.categoryBox.getAll('categories', {index: 'slug'}).nth(0)("items")(project("mainCategory"))
							}
						});
					})
					.orderBy(self.db.r.desc('date'))
					.without(['content'])
					.run(conn, function(err, result) {
							result.toArray(self.cache.add(slug, cb));
						});
			} else {
				self.box
					.map(function(project) {
						return project.merge({
								mainCategory: {
									slug: project("mainCategory"),
									obj: self.categoryBox.getAll('categories', {index: 'slug'}).nth(0)("items")(project("mainCategory"))
							}
						});
					})
					.filter(self.db.r.row('category').contains(slug))
					.orderBy(self.db.r.desc('date'))
					.without(['content'])
					.run(conn, function(err, result) {
							result.toArray(self.cache.add(slug, cb));
						});
			}
		}, cb);
	});
};

Project.prototype.create = function (project, cb) {
	var self = this;

	if (project.content) {
		for (var i in project.content) {
			if (project.content[i].type == "description") {
				this.convertRawText(project.content[i].content);
			}
		}
	}

	this.db.getConnection(function(conn) {
		self.box
			.insert(project)
			.run(conn, self.cache.add(project.slug, cb));
	}, cb);
};

Project.prototype.update = function (slug, to, cb) {
	var self = this;

	if (project.content) {
		for (var i in project.content) {
			if (project.content[i].type == "description") {
				this.convertRawText(project.content[i].content);
			}
		}
	}

	this.db.getConnection(function(conn) {
		self.box
			.get(slug)
			.update(to)
			.run(conn, self.cache.remove(slug, cb));
	}, cb);
};

Project.prototype.remove = function (slug, cb) {
	var self = this;

	this.db.getConnection(function(conn) {
		self.box
			.get(slug)
			.delete()
			.run(conn, self.cache.remove(slug, cb));
	}, cb);
};


module.exports = Project;
