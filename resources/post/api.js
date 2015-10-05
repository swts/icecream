'use strict';
let returnHandler = require('apis-return').handler;

let Post = function() {};

Post.prototype.resource = 'post';

Post.prototype.unitInit = function(units) {
  this.ctrl = units.require('controller');
};

Post.prototype.get = function(auth, data, cb) {
  let options = {};

  if (!(auth && auth.identity)) {
    options.status = 'published';
  }

  if (data.id) {
    this.ctrl.get(data.id, options, returnHandler('NotFound', cb));
  } else if (data.slug) {
    this.ctrl.getBySlug(data.slug, options, returnHandler('NotFound', cb));
  } else {
    if (data.created) {
      options.created = data.created;
    }

    if (data.published) {
      options.published = data.published;
    }

    if (data.limit) {
      options.limit = data.limit;
    }

    options.content = data.content;
    options.preview = data.preview;
    options.author = data.author;
    options.status = data.status;

    this.ctrl.getByCategories(data.categories || data.category, options, returnHandler('NotFound', cb));
  }
};

Post.prototype.create = function(auth, newPost, cb) {
  newPost.author = auth.identity.id;
  this.ctrl.create(newPost, returnHandler('BadRequest', cb));
};

Post.prototype.update = function(auth, data, cb) {
  this.ctrl.update(data.id, data.to, returnHandler('BadRequest', cb));
};

Post.prototype.del = function(auth, data, cb) {
  this.ctrl.remove(data.id, returnHandler('NotFound', cb));
};


module.exports = Post;
