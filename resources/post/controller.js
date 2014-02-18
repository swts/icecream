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
	this.nodeCtrl = units.require('resources.node.controller');
	
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
			{map: function(post) {
				return post.merge({
					content: post("nodes").map(function(id) {
						return self.db.r.table(self.nodeCtrl.box).get(id);
					})
				});
			}},
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

	if(options.withContent) {
		ql.unshift({map: function(post) {
			return post.merge({
				content: post("nodes").map(function(id) {
					return self.db.r.table(self.nodeCtrl.box).get(id);
				})
			});
		}});
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

	query.filter = filter;

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

Post.prototype.createContent = function (data, cb) {
	var self = this;

	this.nodeCtrl.create(data.content, function(err, result) {
		if (err) {
			cb(err, null);
		} else {
			var id = result.generated_keys[0];

			self.db.query({
				box: self.box,
				get: data.slug,
				index: "slug"
			},[{
				replace: function(row) {
					if (data.index) {
						return row.merge({nodes: row("nodes").insertAt(data.index, id)});
					} else {
						return row.merge({nodes: row("nodes").append(id)});
					}
				}
			}], cb);
		}
	});
};

Post.prototype.updateContent = function (id, to, cb) {
	this.nodeCtrl.update(id, to, cb);
};

Post.prototype.removeContent = function (slug, id, cb) {
	var self = this;

	this.nodeCtrl.remove(id, function(err, result) {
		if (err) {
			cb(err, null);
		} else {
			self.db.query({
				box: self.box,
				get: slug,
				index: "slug"
			},
			[{
				replace: function(row) {
					return row.merge({nodes: row("nodes").setDifference([id])});
				}
			}], cb);
		}
	});
};

module.exports = Post;
