var v = require('../validators');

var ItemCreate = v.basedOn(v.ProjectItem, {
	slug: v.dotSlug
});

var ItemUp = v.or(v.EmbeddedContent, v.TextContent, v.HeadlineContent);

var ItemUpdate = {
	slug: v.dotSlug,
	to: {
		content: ItemUp
	}
};

var ItemDel = {slug: v.dotSlug};

module.exports = {
	create: ItemCreate,
	update: ItemUpdate,
	del: ItemDel
};