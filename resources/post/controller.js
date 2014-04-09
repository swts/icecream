"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var async = require('async');

var Post = function () {
	this.db = null;
};
inherits(Post, Unit);

Post.prototype.box = "posts";
Post.prototype.scheme = { indexes: ["slug"] };

Post.prototype.unitInit = function (units) {
	this.db = units.require('db');
	this.nodeCtrl = units.require('resources.node.controller');

	var categories = units.require("core.settings").categories;
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
		r = this.db.r,
		now = Date.now(),
		query = {
			box: this.box,
			get: slug,
			index: "slug"
		},
		ql = [
			{exclude: "id"},
			{map: function(post) {
				return post.merge({
					content: post("nodes").map(function(id) {
						return r.expr([
							id,
							r.table(self.nodeCtrl.box).get(id).without("id")
						]);
					}).coerceTo("object")
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
		r = this.db.r,
		filter,
		now = Date.now(),
		query = {
			box: this.box
		},
		ql = [
			{ orderBy: this.db.r.desc('date') },
			{ exclude: "id" }
		],
		callback = function(err, result) {
			result.toArray(cb);
		};

	if(options.withContent) {
		ql.unshift({map: function(post) {
				return post.merge({
					content: post("nodes").map(function(id) {
						return r.expr([
							id,
							r.table(self.nodeCtrl.box).get(id).without("id")
						]);
					}).coerceTo("object")
				});
			}
		});
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
	var self = this;

	if(!post.status) { post.status = "draft"; }
	if(!post.date) { post.date = Date.now(); }
	if(!post.publish_date && post.status === "published") { post.publish_date = Date.now();}

	async.waterfall([
		function (cb) {
			if(post.content) {
				var nodes = post.content;
				delete post.content;
				self.db.insert(self.nodeCtrl.box, nodes, cb);
			} else {
				cb(null, {});
			}
		},

		function (result, cb) {
			if(result.generated_keys) {
				post.nodes = result.generated_keys;
			}

			self.db.insert(self.box, post, cb);
		}
	], cb);
};

Post.prototype.update = function (slug, to, cb) {
	this.db.update(this.box, slug, to, cb);
};

Post.prototype.remove = function (slug, cb) {
	// remove nodes or not???
	this.db.remove(this.box, slug, cb);
};

Post.prototype.createNode = function (slug, index, node, cb) {
	var self = this,
		r = self.db.r;

	if(index === undefined) { index = -1;}

	this.nodeCtrl.create(node, function(err, result) {
		if (err) {
			cb(err, null);
		} else {
			var id = result.generated_keys[0];

			self.db.query({
				box: self.box,
				get: slug,
				index: "slug"
			},[{
				replace: function(row) {
					return r.branch(
						r.expr(index !== -1).and(row("nodes").count().gt(index)),
						row.merge({nodes: row("nodes").insertAt(index, id)}),
						row.merge({nodes: row("nodes").append(id)})
					);
				}
			}], function (err, result) {
				if(err) {
					cb(err);
				} else {
					cb(null, {id: id});
				}
			});
		}
	});
};

Post.prototype.updateNode = function (id, to, cb) {
	this.nodeCtrl.update(id, to, cb);
};

Post.prototype.removeNode = function (slug, id, cb) {
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
