"use strict";

var StarredProjects = function(env, ctrl) {
	this.tags = ['starredprojects'];
	this.ctrl = ctrl;
	this.env = env;
};

StarredProjects.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

StarredProjects.prototype.render = function(context, args, cb) {
	var self = this;
	this.ctrl.getStarredProjects("starred", function(err, result) {
		if(err) {
			console.error(err);
			cb(null);
		} else {
			self.env.render("projects/starred.html", {projects: result, LANG: context.ctx.LANG}, cb);
		}
	});
};


module.exports = StarredProjects;
