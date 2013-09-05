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
	this.boxProjects = this.db.getBox('projects');
	this.boxCategories = this.db.getBox('categories');
};

Project.prototype.parseSlug = function(slug) {
	return slug.split('.');
};

Project.prototype.convertRawText = function(block) {
	block.html = markdown.toHTML(block.raw);
}

Project.prototype.getProjectByName = function(slug, cb) {
	var self = this;

	this.cache.check(slug, cb, function() {
		self.db.getConnection(function(conn) {
			self.boxProjects
				.map(function(project) {
    				return project.merge({
      					mainCategory: self.boxCategories.get(project("mainCategory"))
        			})
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
			if (slug === "all") {
				self.boxProjects
					.map(function(project) {
	    				return project.merge({
	      					mainCategory: self.boxCategories.get(project("mainCategory"))
	        			})
					})
					.orderBy(self.db.r.desc('date'))
					.without(['content'])
					.run(conn, function(err, result) {
							result.toArray(self.cache.add(slug, cb));
						});
			} else {
				self.boxProjects
					.map(function(project) {
	    				return project.merge({
	      					mainCategory: self.boxCategories.get(project("mainCategory"))
	        			})
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
		self.boxProjects
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
		self.boxProjects
			.get(slug)
			.update(to)
			.run(conn, self.cache.remove(slug, cb));
	}, cb);
};

Project.prototype.remove = function (slug, cb) {
	var self = this;

	this.db.getConnection(function(conn) {
		self.boxProjects
			.get(slug)
			.delete()
			.run(conn, self.cache.remove(slug, cb));
	}, cb);
};


module.exports = Project;
