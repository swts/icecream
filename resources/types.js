'use strict';

const slug = function(low) {
  return {
    type: 'string',
    pattern: '^[-a-z0-9_]{' + (low || 1) + ',60}$'
  }
};

const status = function() {
  return {
    type: 'string',
    enum: [ 'draft', 'ready', 'published' ]
  }
};

const date = function() {
  return {
    oneOf: [
      {
        type: 'array',
        items: {
          type: 'number',
          minValue: 0
        }
      },

      {
        type: 'number',
        minValue: 0
      }
    ]
  }
};

const title = function() {
  return {
    type: 'string',
    maxLength: 140
  }
};

module.exports = { slug, status, date, title };
