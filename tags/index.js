"use strict";
let Post = require("./post");
let Posts = require("./posts");

let Tags = function () {};

Tags.prototype.unitInit = function (units) {
	let env = units.require("core.template");

	if(env && env.addExtension) {
		let ctrl = units.require("post.controller");
		env.addExtension("Post", new Post(env, ctrl));
		env.addExtension("Posts", new Posts(env, ctrl));
	}
};


module.exports = Tags;
