"use strict";
var Post = function(env, ctrl) {
	this.tags = ["post"];
	this.ctrl = ctrl;
	this.env = env;
};

Post.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, "render", args);
};

Post.prototype.renderTemplate = function(post, cb) {
	var template;
	try {
		template = this.env.getTemplate("posts/" + post.slug + ".html");
	} catch(e) {
		template = this.env.getTemplate("posts/post.html");
	}
	template.render({post: post}, cb);
};

Post.prototype.render = function(context, postOrSlug, cb) {
	if(typeof postOrSlug !== "string") {
		this.renderTemplate(postOrSlug, cb);
	} else {
		var self = this,
			options = {};

		if(!context.ctx.auth) {
			options.status = "published";
		}

		this.ctrl.getBySlug(postOrSlug, options, function(err, posts) {
			if(err || !posts) {
				cb(null, "");
			} else {
				self.renderTemplate(posts[0], cb);
			}
		});
	}
};


module.exports = Post;
