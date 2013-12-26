var v = require('../validators');

var ItemCreate = v.basedOn(v.ProjectItem, {
	slug: v.path
});

var ItemUp = v.or(v.EmbeddedContent, v.TextContent, v.HeadlineContent, v.ImageContent);

var ItemUpdate = {
	slug: v.path,
	to: {
		type: v.opt(v.oneOf("text", "headline", "image", "embedded")),
		content: v.opt(ItemUp)
	}
};

var ItemDel = {slug: v.path};

module.exports = {
	create: ItemCreate,
	update: ItemUpdate,
	del: ItemDel
};
