'use strict';
var v = require('../validators'),
	nodeValidators = require('sweets-caramel/resources/node/request');

module.exports = {
	create: function(settings) {
		var validator = {
			slug: v.slug,
			index: v.opt(v.idx),
			content: nodeValidators.create(settings)
		};
		return validator;
	},

	update: function(settings) {
		return nodeValidators.update(settings);
	},

	del: function(settings) {
		return {
			slug: v.slug,
			id: v.str
		};
	}
};
