"use strict";

var Posts = function(env, ctrl) {
	this.tags = ['posts'];
	this.ctrl = ctrl;
	this.env = env;
};

Posts.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

Posts.prototype.render = function(context, slug, cb) {
	var self = this,
		env = this.env,
		options = {withContent: true};

	if(!context.ctx.AUTH) {
		options.status = "published";
	}

	this.ctrl.getByCategory(slug, options, function(err, result) {
		if(err) {
			cb(null);
		} else {
			self.env.render("posts/posts.html", {posts: result, LANGUAGE: context.ctx.LANGUAGE}, cb);
		}
	});
};


module.exports = Posts;
