'use strict';
let isArray = [].isArray;

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

Posts.prototype.render = function(context, postsOrCategory, content, cb) {
  if (!cb) {
    cb = content;
    content = false;
  }

  if (typeof postsOrCategory !== 'string') {
    this.renderTemplate(null, postsOrCategory, cb);
  } else {
    let self = this;
    let options = {
      content: content,
      categories: isArray(postsOrCategory) ? postsOrCategory : [ postsOrCategory ]
    };

    if (!context.ctx.AUTH) {
      options.status = 'published';
    }

    this.ctrl.getByCategories(options, function(err, result) {
      if (err) {
        cb(null);
      } else {
        self.renderTemplate(postsOrCategory, result, cb);
      }
    });
  }
};


module.exports = Posts;
