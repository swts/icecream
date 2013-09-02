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
	
};


module.exports = ProjectList;