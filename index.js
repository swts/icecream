'use strict';
let post = require('./resources/post/units');
let Tags = require('./tags');

module.exports = {
  post,
  'post.tags': new Tags()
};
