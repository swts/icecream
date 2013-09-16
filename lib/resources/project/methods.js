var v = require('../validators');

var ProjectGet = {
	project: v.opt(v.slug),
	category: v.opt(v.slug)
};

var ProjectUp = {
	"slug": v.opt(v.slug),
	"title": v.opt(v.tranStr),
	"mainCategory": v.opt(v.slug),
	"category": v.opt([v.slug]),
	"date": v.opt(v.posInt),
	"order": v.opt([v.slug]),
	"preview": v.opt(v.str),
	"publish_date": v.opt(v.posInt)
};

var ProjectUpdate = {
	slug: v.slug,
	to: ProjectUp
};

var ProjectDel = {
	slug: v.slug
};

module.exports = {
	get: ProjectGet,
	create: v.ProjectCreate,
	update: ProjectUpdate,
	del: ProjectDel
};