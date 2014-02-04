"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var Post = function () {
	this.db = null;
};
inherits(Post, Unit);

Post.prototype.box = "posts";

Post.prototype.unitInit = function (units) {
	var categories = units.require("core.settings").categories;

	this.db = units.require('db');
	
	if (categories) {
		this.categories = categories[this.box];
	}
};

Post.prototype.get = function(slug, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	var self = this,
		now = Date.now()/1000,
		query = {
			box: this.box,
			get: slug,
			index: "slug"
		},
		ql = [
			{nth: 0}
		];

	if(options.status !== undefined) {
		query.filter = function(row) {
			return row('status').eq(options.status).and(row("publish_date").le(now));
		};
	}

	if (this.categories) {
		self.db.joinTree(query, this.categories, ql, cb);
	} else {
		self.db.query(query, ql, cb);
	}
};

Post.prototype.getByCategory = function(category, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	var self = this,
		filter,
		now = Date.now()/1000,
		query = {
			box: this.box
		},
		ql = [{ orderBy: this.db.r.desc('date') }],
		callback = function(err, result) {
			result.toArray(cb);
		};

	if(!options.withContent) {
		ql.push({without: ['content']});
	}

	if (category !== "all" && category !== undefined) {
		if(options.status) {
			filter = function(row) {
				return row('categories').contains(category).and(row('status').eq(options.status)).and(row("publish_date").le(now));
			};
		} else {
			filter = function(row) {
				return row('categories').contains(category);
			};
		}
	} else {
		if (options.status) {
			filter = function(row) {
				return row('status').eq(options.status).and(row("publish_date").le(now));
			};
		}
	}

	query.filer = filter;

	if (this.categories) {
		this.db.joinTree(query, this.categories, ql, callback);
	} else {
		this.db.query(query, ql, callback);
	}
	
};

Post.prototype.create = function (post, cb) {
	this.db.insert(this.box, post, cb);
};

Post.prototype.update = function (slug, to, cb) {
	this.db.update(this.box, slug, to, cb);
};

Post.prototype.remove = function (slug, cb) {
	this.db.remove(this.box, slug, cb);
};

Post.prototype.createContent = function (item, cb) {
	var path = this.db.getPath(item.slug, "content");

	delete item.slug;
	this.db.insert(this.box, path, item, cb);
};

Post.prototype.updateContent = function (item, data, cb) {
	var path = this.db.getPath(item, "content");
	this.db.update(this.box, path, data, cb);
};

Post.prototype.renameContent = function(item, newName, cb) {
	var path = this.db.getPath(item, "content");
	this.db.rename(this.box, path, newName, cb);
};

Post.prototype.removeContent = function (item, cb) {
	var path = this.db.getPath(item, "content");
	this.db.remove(this.box, path, cb);
};

module.exports = Post;
