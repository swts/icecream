"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;
var Uch = require('uch');

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
};

Project.prototype.parseSlug = function(slug) {
	return slug.split('.');
};

Project.prototype.getProject = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			self.box
				.get(slug)
				.without([{"category" : "items"}, {"category" : "icon"}])
				.run(conn, self.cache.add(slug, cb));
		}, cb);
	});
};

Project.prototype.getCategory = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			console.log(slug);
			if (slug === "all") {
				self.box
					.run(conn, self.cache.add(slug, cb));
			} else {
				self.box
					.filter({category: slug})
					.without([{"category" : "items"}, {"category" : "icon"}])
					.run(conn, self.cache.add(slug, cb));				
			}
		}, cb);
	});
};

Project.prototype.getMenu = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			self.box
				.pluck("category")
				.run(conn, self.cache.add(slug, cb));
		}, cb);
	});
};

Project.prototype.create = function (Project, cb) {
	var self = this;

	this.db.getConnection(function(conn) {
		self.box
			.insert(Project)
			.run(conn, self.cache.add(Project.slug, cb));
	}, cb);
};

Project.prototype.update = function (slug, to, cb) {
	var self = this;
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
