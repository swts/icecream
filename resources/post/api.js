'use strict';
let returnHandler = require('apis-return').handler;
let isArray = Array.isArray;

let Post = function() {};

Post.prototype.resource = 'post';

Post.prototype.unitInit = function(units) {
  this.ctrl = units.require('controller');
};

Post.prototype.get = function(auth, data, cb) {
  let options = this.getOptions(auth, data);

  if (options.id) {
    this.ctrl.get(options.id, returnHandler('NotFound', cb));
  } else if (options.slug) {
    this.ctrl.getBySlug(options, returnHandler('NotFound', cb));
  } else if (options.count) {
    options.count = true;
    this.ctrl.getByCategories(options, returnHandler('NotFound', cb));
  } else {
    this.ctrl.getByCategories(options, returnHandler('NotFound', cb));
  }
};

Post.prototype.getOptions = function(auth, data) {
  if (!auth) {
    data.status = 'published';

    let now = Date.now();

    if (isArray(data.published)) {
      if (data.published[1] === undefined || data.published[1] > now) {
        data.published[1] = now;
      }
    } else if (data.published === undefined || data.published > now) {
      data.published = now;
    }
  }

  return data;
};

Post.prototype.create = function(auth, newPost, cb) {
  newPost.author = auth.identity;
  this.ctrl.create(newPost, returnHandler('BadRequest', cb));
};

Post.prototype.update = function(auth, data, cb) {
  this.ctrl.update(data.id, data.to, returnHandler('BadRequest', cb));
};

Post.prototype.del = function(auth, data, cb) {
  this.ctrl.remove(data.id, returnHandler('NotFound', cb));
};


module.exports = Post;
