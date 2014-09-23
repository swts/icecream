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

Posts.prototype.render = function(context, slug, withContent, cb) {
	if(!cb) {
		cb = withContent;
		withContent = false;
	}

	var self = this,
		env = this.env,
		options = {withContent: withContent};

	if(!context.ctx.auth) {
		options.status = "published";
	}

	this.ctrl.getByCategory(slug, options, function(err, result) {
		if(err) {
			cb(null);
		} else {
			var template;
			try {
				template = env.getTemplate("posts/category-"+ slug +".html");
			} catch(e) {
				template = env.getTemplate("posts/posts.html");
			}
			template.render({posts: result, LANGUAGE: context.ctx.LANGUAGE}, cb);
		}
	});
};


module.exports = Posts;
