"use strict";
let valid = require("sweets-valid");
let v = valid.validators;
let status = v.oneOf("draft", "ready", "published");

module.exports = {
	or: v.or,
	str: v.str,
	bool: v.bool,
	opt: v.opt,
	idx: v.idx,
	slug: v.slug,
	path: v.path,
	oneOf: v.oneOf,
	posInt: v.posInt,
	status: status
};
