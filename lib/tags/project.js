"use strict";

var ProjectTag = function(env, ctrl) {
	this.tags = ['project'];
	this.ctrl = ctrl;
	this.env = env;
};

ProjectTag.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

ProjectTag.prototype.render = function(context, slug, cb) {
	var self = this;
	
	this.ctrl.getProject(slug, function(err, result) {
		if(err) {
			cb(err);
		} else {
			self.env.render("projects/project.html", result, cb);
		}
	});
};


module.exports = ProjectTag;