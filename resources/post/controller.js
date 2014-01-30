"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var Post = function () {
	this.db = null;
	this.box = "posts";
};
inherits(Post, Unit);

Post.prototype.unitInit = function (units) {
	this.db = units.require('db');
};

Post.prototype.get = function(slug, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	var self = this,
		query = {
			box: this.box,
			get: slug,
			index: "slug"
		};

	if(options.status !== undefined) {
		query.filter = function(row) {
			return row('status').eq(options.status);
		};
	}

	self.db.joinTree(query, {
			to: "categories",
			from: "trees",
			fromSlug: "categories",
			fromProperty: "items"
		}, [
			{nth: 0}
		],
		cb
	);
};

Post.prototype.getByCategory = function(category, options, cb) {
	if(cb === undefined) {
		cb = options;
		options = {};
	}

	var filter,
		post = [{ orderBy: this.db.r.desc('date') }];

	if(!options.withContent) {
		post.push({without: ['content']});
	}

	if (category !== "all" && category !== undefined) {
		if(options.status) {
			filter = function(row) {
				return row('categories').contains(category).and(row('status').eq(options.status));
			};
		} else {
			filter = function(row) {
				return row('categories').contains(category);
			};
		}
	} else {
		if (options.status) {
			filter = function(row) {
				return row('status').eq(options.status);
			};
		}
	}

	this.db.joinTree({
			box: this.box,
			filter: filter
		}, {
			to: "categories",
			from: "trees",
			fromSlug: "categories",
			fromProperty: "items"
		},
		post,
		function(err, result) {
			result.toArray(cb);
	});
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
