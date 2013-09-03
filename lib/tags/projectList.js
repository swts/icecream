"use strict";

var ProjectList = function(env, ctrl) {
	this.tags = ['projectList'];
	this.ctrl = ctrl;
	this.env = env;
};

ProjectList.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

ProjectList.prototype.render = function(context, slug, cb) {
	var self = this;
	
	this.ctrl.getCategory(slug, function(err, result) {
		if(err) {
			cb(err);
		} else {
			self.env.render("projects/projectList.html", {list: result}, cb);
		}
	});
};


module.exports = ProjectList;