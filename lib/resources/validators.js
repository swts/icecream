"use strict";

var valid = require('sweets-valid');
var v = valid.validators;


var EmbeddedContent = {
	"html": v.str,
	"title": v.opt(v.str)
};

var TextContent = v.str;

var HeadlineContent = v.str;

var ImageContent = {
	src: v.opt(v.str)
};

var ProjectItem = {
	"type": v.oneOf("text", "headline", "image", "embedded"),
	"content": v.or(EmbeddedContent, TextContent, HeadlineContent, ImageContent)
};

module.exports = {
	or: v.or,
	str: v.str,
	opt: v.opt,
	basedOn: valid.basedOn,
	slug: v.slug,
	path: v.path,
	oneOf: v.oneOf,
	posInt: v.posInt,
	dict: v.dict,
	ProjectItem: ProjectItem,
	EmbeddedContent: EmbeddedContent,
	TextContent: TextContent,
	HeadlineContent: HeadlineContent,
	ImageContent: ImageContent,
	translate: valid.translate
};

