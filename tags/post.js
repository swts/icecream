"use strict";
let Post = function(env, ctrl) {
	this.tags = ["post"];
	this.ctrl = ctrl;
	this.env = env;
};

Post.prototype.parse = function(parser, nodes) {
	let token = parser.nextToken();
	let args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, "render", args);
};

Post.prototype.renderTemplate = function(ctx, post, cb) {
	let template;
	try {
		template = this.env.getTemplate("posts/" + post.slug + ".html");
	} catch(e) {
		template = this.env.getTemplate("posts/post.html");
	}

	let data = {post: post};
	for (var prop in ctx) {
		data[prop] = ctx[prop];
	}

	template.render(data, cb);
};

Post.prototype.render = function(context, postOrSlug, cb) {
	if(typeof postOrSlug !== "string") {
		this.renderTemplate(postOrSlug, cb);
	} else {
		let self = this,
			options = {};

		if(!context.ctx.auth) {
			options.status = "published";
		}

		this.ctrl.getBySlug(postOrSlug, options, function(err, posts) {
			if(err || !posts) {
				cb(null, "");
			} else {
				self.renderTemplate(context.ctx, posts[0], cb);
			}
		});
	}
};


module.exports = Post;
