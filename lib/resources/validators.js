"use strict";

var valid = require('valid');
var v = valid.validators;
var opt = v.opt;

var slug = v.rx(/^[-a-z0-9_]{1,60}$/);
var dotSlug = v.rx(/^[-\.a-z0-9_]{1,60}$/);

var tranStr = {
	en: v.str,
	ru: v.str
};

var MediaContent = {
	"src": v.str,
	"title": opt(tranStr)
};

var TextContent = {
	"raw": tranStr,
	"html": opt(tranStr)
};

var HeadlineContent = tranStr;

var ProjectItem = {
	"type": v.oneOf("text", "headline", "image", "audio", "video"),
	"content": v.or(MediaContent, TextContent, HeadlineContent)
}

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
}



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
	MediaContent: MediaContent,
	TextContent: TextContent,
	HeadlineContent: HeadlineContent
};

