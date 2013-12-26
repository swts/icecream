var v = require('../validators');

var ItemCreate = v.basedOn(v.ProjectItem, {
	slug: v.path
});

var ItemUp = v.or(v.EmbeddedContent, v.TextContent, v.HeadlineContent);

var ItemUpdate = {
	slug: v.path,
	to: {
		content: ItemUp
	}
};

var ItemDel = {slug: v.path};

module.exports = {
	create: ItemCreate,
	update: ItemUpdate,
	del: ItemDel
};
