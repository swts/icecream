"use strict";

var valid = require('sweets-valid');
var v = valid.validators;
var translate = valid.translate;

var status = v.oneOf("draft", "ready", "published");
var contentType = v.oneOf("text", "headline", "image", "vimeo", "embedded");
var contentImage = { src: v.str };
var contentVimeo = {
	id: v.posInt,
	width: v.posInt,
	height: v.posInt,
	title: v.opt(v.str),
	duration: v.opt(v.idx),
	thumbnailS: v.opt(v.url),
	thumbnailM: v.opt(v.url),
	thumbnailL: v.opt(v.url),
};

var content = {
	type: contentType,
	content: v.or(
		v.str,
		contentImage,
		contentVimeo
	)
};

var translateContent = function(languages) {
	return {
		type: contentType,
		content: v.or(
			translate(v.str, languages),
			v.str,
			contentImage,
			contentVimeo
		)
	};
};


module.exports = {
	or: v.or,
	str: v.str,
	bool: v.bool,
	opt: v.opt,
	basedOn: valid.basedOn,
	slug: v.slug,
	path: v.path,
	oneOf: v.oneOf,
	posInt: v.posInt,
	dict: v.dict,

	content: content,
	translateContent: translateContent,
	translate: translate
};

