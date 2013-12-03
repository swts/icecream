"use strict";

var valid = require('valid');
var v = valid.validators;
var opt = v.opt;

var slug = v.rx(/^[-a-z0-9_]{1,60}$/);
var dotSlug = v.rx(/^[-a-z0-9_\/]{1,200}$/);

var tranStr = {
	en: v.str,
	ru: v.str
};

var EmbeddedContent = {
	"html": v.str,
	"title": opt(tranStr)
};

var TextContent = opt(tranStr);

var HeadlineContent = tranStr;

var ProjectItem = {
	"type": v.oneOf("text", "headline", "image", "embedded"),
	"content": v.or(EmbeddedContent, TextContent, HeadlineContent)
};

var ProjectCreate = {
	"slug": slug,
	"title": tranStr,
	"mainCategory": slug,
	"category": [slug],
	"date": v.posInt,
	"order": [slug],
	"items": v.dict(slug, ProjectItem),
	"preview": v.str,
	"publish_date": v.posInt
};



module.exports = {
	or: v.or,
	str: v.str,
	opt: opt,
	basedOn: valid.basedOn,
	slug: slug,
	dotSlug: dotSlug,
	tranStr: tranStr,
	posInt: v.posInt,
	ProjectCreate: ProjectCreate,
	ProjectItem: ProjectItem,
	EmbeddedContent: EmbeddedContent,
	TextContent: TextContent,
	HeadlineContent: HeadlineContent
};

