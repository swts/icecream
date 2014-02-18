"use strict";

var valid = require('sweets-valid');
var v = valid.validators;
var translate = valid.translate;

var status = v.oneOf("draft", "ready", "published");


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
	status: status,

	translate: translate
};

