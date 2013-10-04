"use strict";

var Projects = function(env, ctrl) {
	this.tags = ['projects'];
	this.ctrl = ctrl;
	this.env = env;
};

Projects.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

Projects.prototype.render = function(context, slug, cb) {
	var self = this,
		callback = function(err, result) {
			if(err) {
				console.error(err);
				cb(null);
			} else {
				self.env.render("projects/projects.html", {projects: result, LANG: context.ctx.LANG}, cb);
			}
		};

	if (slug === "starred") {
		this.ctrl.getStarredProjects(callback);
	} else {
		this.ctrl.getProjectByCategory(slug, callback);
	}
	
};


module.exports = Projects;
