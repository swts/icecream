# Sweets
Flexible declarative web framework for real-time projects

## Icecream
**Ordered nodes ([see Caramel](http://github.com/swts/caramel))**




## Object structure

### "posts" table
```js
{
	slug: "item slug",
	title: "string" || {}					// translation here and further depends on Sweets app settings
	categories: ["public", "starred"],		// array of trees/categories items - optional
	nodes: ["id"],							// content ids, see sweets-caramel
	preview: "/path/to/preview/image/or/something",
	status: "published"						// "draft" and "published" are currently supported, "draft" posts are not available for unauthorized users
	published: 1262341787,					// published timestamp
	created: 1262341787,					// created timestamp
}
```


Categories are stored as slugs from [Marshmallow](https://github.com/swts/marshmallow) and are merged on get request. To define merge entry set the following object in Sweets app settings: 
```js
this.categories = {
	"posts": {
		to: "categories",
		from: "trees",
		fromSlug: "categories",
		fromProperty: "items"
	}
}
```

## API
There are two resources: /post and /post/node - the second one is a wrapper to access post content - slugs for it look like "postSlug/nodeId". 
_Api won't return unpublished posts for non-authorised user._
Get request returns resource objects, which are described below, and is only available for /post resource. Delete request objects for both resources are similar:
#### GET
```js
{
	slug: "slug"		// return post by slug
}
```
or
```js
{
	category: "slug",	// return posts by category - "all" may be provided to return everything
	withContent: bool	// optional, will exclude content field by default
}

// category request will return projects with "published" status and publish_date <= Date.now() for unauthorized users, and all projects for authorized
```



#### CREATE
##### /post
There are two ways new post may be provided
```js
// for objects with previously created nodes (so you can assemble nodes array)
{resource object}

// for objects without nodes in nodes table "content" property may be provided instead of "nodes"; other properties are similar to resource object
{
	content: [nodes] 		// see Caramel for nodes validators
}
```

##### /post/node
```js
{
	slug: "slug",
	index: index,
	node: {node object}
}
```

#### UPDATE
##### /post
```js
{
	slug: "slug", 
	to: {resource object without "content" property}
}
```

##### /post/node
```js
{
	slug: "node id"
}
```

#### DELETE
```js
{slug: "slug"}
```

## Tags
Two tags are currently supported: {% post "slug" %} {% posts "categorySlug" %} - render templates are up to you and should be stored in /templates/posts/ folder under post.html and posts.html name.
