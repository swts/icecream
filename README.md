# Sweets
Next Web builder toolkit

## Icecream
**Sweet for posts**

## Object structure

### "posts" table

```js
{
	slug: "item slug",
	title: {
		ru: "Ru title",
		en: "En title"
	},
	categories: ["public", "starred"],		// array of trees/categories items
	date: 1262341787,
	order: ["0", "1", "2", "3"],			// items' slugs
	content: {
			0: {
				type: "image",
				content: {
					src: "/path/to/image"
				}
			},
			1: {
				type: "text",
				content: {
					ru: "Ru text",
					en: "En text"
				}
			},
			3: {
				type: "headline",
				content: {
					ru: "Ru headline",
					en: "En headline"
				}
			},
			4: {
				type: "embedded",
				content: {
					html: "embedded html"
				}
			}
	},
	preview: "/path/to/preview/image",
	publish_date: 1262341787,
	status: "published"				// "draft" and "published" are currently supported, "draft" posts are not available for unauthorized users
}
```

## API
There are two resources: /post and /post/content - the second one is a wrapper to access post content - slugs for it look like "post slug"/"content slug". Get request returns resource objects, which are described below, and is only available for /post resource. Other request objects for both resources are similar:

#### GET
```js
{
	slug: "slug"		// return post by slug
}
```
or
```js
{
	category: "slug",	// return posts by category
	withContent: bool	// optional, will exclude content field by default
}


#### CREATE
```js
{resource object}
```

#### UPDATE
```js
{
	slug: "slug", 
	to: {resource object}
}
```

#### DELETE
```js
{slug: "slug"}
```

## Tags
One tag is currently supported: {% posts "slug" %} - render template is up to you and should be stored in /templates/posts/ folder under posts.html name.

## TODO
	Hide posts with publish_date > Date.now() for unauthorized users
	Remove marshmallow dependancy - post might not have category