'use strict';
const Post = require('./post');
const Posts = require('./posts');

const Tags = function() {};

Tags.prototype.__init = function(units) {
  const env = units.require('core.template');

  if (env && env.addExtension) {
    const ctrl = units.require('post.controller');
    env.addExtension('Post', new Post(env, ctrl));
    env.addExtension('Posts', new Posts(env, ctrl));
  }
};


module.exports = Tags;
