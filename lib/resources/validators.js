"use strict";

var valid = require('valid');
var v = valid.validators;
var opt = v.opt;

var slug = v.rx(/^[-a-z0-9_]{1,60}$/);
var path = v.rx(/^[-a-z0-9_\/]{1,200}$/);

var tranStr = {
	en: v.str,
	ru: v.str
};

var oneOfTrans = {
	en: opt(v.str),
	ru: opt(v.str)
};

var EmbeddedContent = {
	"html": v.str,
	"title": opt(oneOfTrans)
};

var TextContent = opt(oneOfTrans);

var HeadlineContent = opt(oneOfTrans);

var ImageContent = {
	src: opt(v.str)
};

var ProjectItem = {
	"type": v.oneOf("text", "headline", "image", "embedded"),
	"content": v.or(EmbeddedContent, TextContent, HeadlineContent, ImageContent)
};

var ProjectCreate = {
	"slug": slug,
	"title": tranStr,
	"categories": [path],
	"date": v.posInt,
	"order": [slug],
	"items": v.dict(slug, ProjectItem),
	"preview": v.str,
	"publish_date": v.posInt,
	"status": v.str
};



module.exports = {
	or: v.or,
	str: v.str,
	opt: opt,
	basedOn: valid.basedOn,
	slug: slug,
	path: path,
	tranStr: tranStr,
	oneOfTrans: oneOfTrans,
	posInt: v.posInt,
	ProjectCreate: ProjectCreate,
	ProjectItem: ProjectItem,
	EmbeddedContent: EmbeddedContent,
	TextContent: TextContent,
	HeadlineContent: HeadlineContent,
	ImageContent: ImageContent
};

