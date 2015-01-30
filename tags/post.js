"use strict";

var render = function(env, post, cb) {
	var template;
	try {
		template = env.getTemplate("posts/"+ post.slug +".html");
	} catch(e) {
		template = env.getTemplate("posts/post.html");
	}
	template.render({post: post}, cb);
};

var Post = function(env, ctrl) {
	this.tags = ['post'];
	this.ctrl = ctrl;
	this.env = env;
};

Post.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

Post.prototype.render = function(context, postOrSlug, cb) {
	if(typeof postOrSlug !== "string") {
		render(this.env, postOrSlug, cb);
	} else {
		var self = this,
			options = {};

		if(!context.ctx.auth) {
			options.status = "published";
		}

		this.ctrl.get(postOrSlug, options, function(err, result) {
			if(err) {
				cb(null, "");
			} else {
				render(self.env, result, cb);
			}
		});
	}
};


module.exports = Post;
