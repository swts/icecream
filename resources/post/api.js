"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var returnHandler = require('apis-return').handler;

var Post = function () {};
inherits(Post, Unit);

Post.prototype.name = 'post';

Post.prototype.unitInit = function (units) {
	this.ctrl = units.require('controller');
};

Post.prototype.get = function (auth, data, cb) {
	var showDraft = auth && auth.identity;

	if (data.slug) {
		this.ctrl.get(data.slug, showDraft, returnHandler("NotFound", cb));
	} else if (data.category) {
		this.ctrl.getByCategory(data.category, {
			showDraft: showDraft,
			withContent: data.withContent
		}, returnHandler("NotFound", cb));
	}
};

Post.prototype.create = function (auth, newPost, cb) {
	this.ctrl.create(newPost, returnHandler("BadRequest", cb));
};

Post.prototype.update = function (auth, postData, cb) {
	this.ctrl.update(postData.slug, postData.to, returnHandler("BadRequest", cb));
};

Post.prototype.del = function (auth, postData, cb) {
	this.ctrl.remove(postData.slug, returnHandler("NotFound", cb));
};


module.exports = Post;
