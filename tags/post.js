'use strict';
let Post = function(env, ctrl) {
  this.tags = [ 'post' ];
  this.ctrl = ctrl;
  this.env = env;
};

Post.prototype.parse = function(parser, nodes) {
  let token = parser.nextToken();
  let args = parser.parseSignature(null, true);
  parser.advanceAfterBlockEnd(token.value);
  return new nodes.CallExtensionAsync(this, 'render', args);
};

Post.prototype.renderTemplate = function(post, cb) {
  let template;
  try {
    template = this.env.getTemplate('posts/' + post.slug + '.html');
  } catch (e) {
    template = this.env.getTemplate('posts/post.html');
  }

  template.render({ post }, cb);
};

Post.prototype.render = function(context, postOrSlug, cb) {
  if (typeof postOrSlug !== 'string') {
    this.renderTemplate(postOrSlug, cb);
  } else {
    let options = {
      slug: postOrSlug,
      preview: true,
      content: true
    };

    if (!context.ctx.auth) {
      options.status = 'published';
    }

    this.ctrl
      .getAll(options)
      .asCallback((err, posts) => {
        if (err || !posts) {
          cb(null, '');
        } else {
          this.renderTemplate(posts[0], cb);
        }
      });
  }
};


module.exports = Post;
