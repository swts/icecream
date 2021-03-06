'use strict';
const mmhandler = require('mm-errors').handler;
const types = require('../types');
const isArray = Array.isArray;

const Api = function() {
  this.ctrl = undefined;
};

Api.prototype.__init = function(units) {
  this.ctrl = units.require('controller');
  this.node = units.require('resources.node.api');
};

Api.prototype.calls = [
  'get', 'getAll',
  'create', 'update', 'delete',
  'addNode', 'updateNode', 'deleteNode',
  'addPreview', 'updatePreview', 'deletePreview'
];

Api.prototype.getOptions = function(auth, data) {
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

Api.prototype.getSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: 'optional'
    },
    title: 'Post',
    description: 'Returns a post',
    request: {
      type: 'object',
      additionalProperties: false,
      required: [ 'id' ],
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        }
      }
    }
  }
};

Api.prototype.get = function(auth, data, cb) {
  this.ctrl
    .get(data.id)
    .asCallback(mmhandler('NotFound', cb));
};

Api.prototype.getAllSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: 'optional'
    },
    title: 'Post',
    description: 'Returns a posts collection',
    request: {
      type: 'object',
      additionalProperties: false,
      properties: {
        author: {
          type: 'string',
          format: 'uuid'
        },
        created: types.date(),
        published: types.date(),
        status: types.status(),
        limit: {
          type: 'integer',
          minimum: 0
        },
        quantity: {
          type: 'boolean'
        },
        content: {
          type: 'boolean'
        },
        preview: {
          type: 'boolean'
        },

        slug: types.slug(),

        categories: {
          type: 'array',
          items: types.slug()
        }
      }
    }
  }
};

Api.prototype.getAll = function(auth, data, cb) {
  this.ctrl
    .getAll( this.getOptions(auth, data) )
    .asCallback(mmhandler('NotFound', cb));
};

Api.prototype.createSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: true
    },
    title: 'Post',
    description: 'Creates a post',
    request: {
      type: 'object',
      additionalProperties: false,
      required: [ 'slug' ],
      properties: {
        slug: types.slug(),
        title: types.title(),
        status: types.status(),
        categories: {
          type: 'array',
          items: types.slug()
        },
        published: {
          type: 'number',
          minValue: 0
        },
        type: {
          type: 'string'
        },
        content: {
          type: 'array',
          items: this.node.createSchema().request
        },
        preview: this.node.createSchema().request
      }
    }
  }
};

Api.prototype.create = function(auth, data, cb) {
  data.author = auth.id;
  this.ctrl
    .create(data)
    .asCallback(mmhandler('BadRequest', cb));
};

Api.prototype.updateSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: true
    },
    title: 'Post',
    description: 'Updates post\'s properties',
    request: {
      type: 'object',
      additionalProperties: false,
      required: [ 'id', 'to' ],
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        },

        to: {
          type: 'object',
          additionalProperties: false,
          properties: {
            slug: types.slug(),
            title: types.title(),
            status: types.status(),
            nodes: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid'
              }
            },
            categories: {
              type: 'array',
              items: types.slug()
            },
            published: {
              type: 'number',
              minValue: 0
            }
          }
        }
      }
    }
  }
};

Api.prototype.update = function(auth, data, cb) {
  this.ctrl
    .update(data.id, data.to)
    .asCallback(mmhandler('BadRequest', cb));
};

Api.prototype.deleteSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: true
    },
    title: 'Post',
    description: 'Deletes a post',
    request: {
      type: 'object',
      additionalProperties: false,
      required: [ 'id' ],
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        }
      }
    }
  }
};

Api.prototype.delete = function(auth, data, cb) {
  this.ctrl
    .delete(data.id)
    .asCallback(mmhandler('NotFound', cb))
};

//nodes
Api.prototype.addNodeSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: true
    },
    title: 'Post',
    description: 'Creates a post',
    request: {
      type: 'object',
      additionalProperties: false,
      required: [ 'id', 'node' ],
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        },
        index: {
          type: 'integer',
          minimum: 0
        },
        node: this.node.createSchema().request
      }
    }
  };
};

Api.prototype.addNode = function(auth, data, cb) {
  this.ctrl
    .addNode(data.id, data.node, data.index)
    .asCallback(mmhandler('BadRequest', cb));
};

Api.prototype.updateNodeSchema = function() {
  return this.node.updateSchema();
};

Api.prototype.updateNode = function(auth, data, cb) {
  this.ctrl
    .updateNode(data.id, data.to.content)
    .asCallback(mmhandler('BadRequest', cb));
};

Api.prototype.deleteNodeSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: true
    },
    title: 'Post',
    description: 'Creates a post',
    request: {
      type: 'object',
      additionalProperties: false,
      required: [ 'id', 'node' ],
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        },
        node: {
          type: 'string',
          format: 'uuid'
        }
      }
    }
  };
};

Api.prototype.deleteNode = function(auth, data, cb) {
  this.ctrl
    .deleteNode(data.id, data.node)
    .asCallback(mmhandler('NotFound', cb));
};

//preview
Api.prototype.addPreviewSchema = function() {
  let schema = this.addNodeSchema();
  delete schema.request.properties.index;
  return schema;
};

Api.prototype.addPreview = function(auth, data, cb) {
  this.ctrl
    .addPreivew(data.id, data.node)
    .asCallback(mmhandler('BadRequest', cb));
};

Api.prototype.updatePreviewSchema = function() {
  return this.updateNodeSchema();
};

Api.prototype.updatePreview = function(auth, data, cb) {
  this.ctrl
    .updatePreview(data.id, data.to.content)
    .asCallback(mmhandler('BadRequest', cb));
};

Api.prototype.deletePreviewSchema = function() {
  return this.deleteNodeSchema();
};

Api.prototype.deletePreview = function(auth, data, cb) {
  this.ctrl
    .deletePreview(data.id, data.node)
    .asCallback(mmhandler('NotFound', cb));
};

module.exports = Api;
