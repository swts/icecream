"use strict";

var render = function(env, category, posts, cb) {
	var template;
	try {
		template = env.getTemplate("posts/category-"+ category +".html");
	} catch(e) {
		template = env.getTemplate("posts/posts.html");
	}
	template.render({posts: posts}, cb);
};

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

Posts.prototype.render = function(context, postsOrCategory, withContent, cb) {
	if(!cb) {
		cb = withContent;
		withContent = false;
	}

	if(typeof postsOrCategory !== "string") {
		render(this.env, null, postsOrCategory, cb);
	} else {
		var self = this,
			env = this.env,
			options = {withContent: withContent};

		if(!context.ctx.auth) {
			options.status = "published";
		}

		this.ctrl.getByCategory(postsOrCategory, options, function(err, result) {
			if(err) {
				cb(null);
			} else {
				render(self.env, postsOrCategory, result, cb);
			}
		});
	}
};


module.exports = Posts;
