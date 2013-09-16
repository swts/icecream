"use strict";

var StarredProjects = function(env, ctrl) {
	this.tags = ['starredProjects'];
	this.ctrl = ctrl;
	this.env = env;
};

StarredProjects.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

StarredProjects.prototype.render = function(context, slug, cb) {
	var self = this;

	console.log("slug");
	this.ctrl.getStarredProjects("starred", function(err, result) {
		if(err) {
			console.error(err);
			cb(null);
		} else {
			self.env.render("projects/starredProjects.html", {starredProjects: result}, cb);
		}
	});
};


module.exports = StarredProjects;
