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

Post.prototype.get = function(auth, slug, cb) {
	var self = this,
		query = {
			box: this.box,
			get: slug,
			index: "slug"
		};

	if(!auth) {
		query.filter = function(row) {
			row('status').eq("published");
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

Post.prototype.getByCategory = function(category, auth, withContent, cb) {
	var filter,
		post = [{ orderBy: this.db.r.desc('date') }];

	if(!withContent) {
		post.push({without: ['content']});
	}

	if (category !== "all" && category !== undefined) {
		if(!auth) {
			filter = function(row) {
				return row('categories').contains(category).and(row('status').eq("published"));
			};
		} else {
			filter = function(row) {
				return row('categories').contains(category);
			};
		}
	} else {
		if (!auth) {
			filter = function(row) {
				return row('status').eq("published");
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
