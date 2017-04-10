'use strict';
let isArray = Array.isArray;

let Posts = function(env, ctrl) {
  this.tags = [ 'posts' ];
  this.ctrl = ctrl;
  this.env = env;
};

Posts.prototype.parse = function(parser, nodes) {
  let token = parser.nextToken();
  let args = parser.parseSignature(null, true);
  parser.advanceAfterBlockEnd(token.value);
  return new nodes.CallExtensionAsync(this, 'render', args);
};


Posts.prototype.renderTemplate = function(category, posts, cb) {
  let template;
  try {
    template = this.env.getTemplate('posts/category-' + category + '.html');
  } catch (e) {
    template = this.env.getTemplate('posts/posts.html');
  }
  template.render({ category: category, posts: posts }, cb);
};

Posts.prototype.render = function(context, postsOrCategory, preview = false, content = false, cb) {
  if (!cb) {
    cb = content;
    content = false;
  }

  if (typeof postsOrCategory !== 'string') {
    return this.renderTemplate(null, postsOrCategory, cb);
  }

  let options = {
    content: content,
    preview: preview,
    categories: isArray(postsOrCategory) ? postsOrCategory : [ postsOrCategory ]
  };

  if (!context.ctx.AUTH) {
    options.status = 'published';
  }

  this.ctrl
    .getAll(options)
    .catch(() => cb(null))
    .then(result => this.renderTemplate(postsOrCategory, result, cb));
};


module.exports = Posts;
