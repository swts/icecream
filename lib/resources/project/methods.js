var v = require('../validators');

var ProjectGet = {
	slug: v.opt(v.slug),
	category: v.opt(v.path)
};

var ProjectCreate = {
	"slug": v.slug,
	"title": v.str,
	"categories": [v.path],
	"date": v.posInt,
	"order": [v.slug],
	"items": v.dict(v.slug, v.ProjectItem),
	"preview": v.str,
	"publish_date": v.posInt,
	"status": v.str
};

var ProjectUp = {
	"slug": v.opt(v.slug),
	"title": v.opt(v.str),
	"categories": v.opt([v.path]),
	"date": v.opt(v.posInt),
	"order": v.opt([v.slug]),
	"preview": v.opt(v.str),
	"publish_date": v.opt(v.posInt),
	"scheme": v.opt(v.str),
	"status": v.opt(v.str)
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
	create: ProjectCreate,
	update: ProjectUpdate,
	del: ProjectDel
};
