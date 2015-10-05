'use strict';
let valid = require('sweets-valid');
let v = valid.validators;
let status = v.oneOf('draft', 'ready', 'published');

let vDate = v.or(
  v.posInt,
  [ v.posInt ]
);

let posts = {
  author: v.opt(v.uuid),
  created: v.opt(vDate),
  published: v.opt(vDate),
  limit: v.opt(v.idx),
  content: v.opt(v.bool),
  status: v.opt(v.str),
  preview: v.opt(v.bool)
}

module.exports = {
  posts,
  status,
  uuid: v.uuid,
  slug: v.slug,
  path: v.path,
  bool: v.bool,
  idx: v.idx,
  str: v.str,
  or: v.or,
  opt: v.opt,
  oneOf: v.oneOf,
  posInt: v.posInt,
  basedOn: valid.basedOn
};
