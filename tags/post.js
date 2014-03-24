"use strict";

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

Post.prototype.render = function(context, slug, cb) {
	var self = this,
		env = this.env,
		options = {};

	if(!context.ctx.AUTH) {
		options.status = "published";
	}

	this.ctrl.get(slug, options, function(err, result) {
		if(err) {
			cb(null);
		} else {
			var template;
			try {
				template = env.getTemplate("posts/"+ slug +".html");
			} catch(e) {
				template = env.getTemplate("posts/post.html");
			}
			template.render({post: result, LANGUAGE: context.ctx.LANGUAGE}, cb);
		}
	});
};


module.exports = Post;
