"use strict";

var ProjectMenu = function(env, ctrl) {
	this.tags = ['projectMenu'];
	this.ctrl = ctrl;
	this.env = env;
};

ProjectMenu.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtensionAsync(this, 'render', args);
};

ProjectMenu.prototype.render = function(context, slug, cb) {
	var self = this;
	
};


module.exports = ProjectMenu;