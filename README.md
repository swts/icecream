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
	status: "published"				// "draft" and "published" are currently supported, "draft" projects are not available for unauthorized users
}
```

## API
There are two resources: /post and /post/content - the second one is a wrapper to access project items - slugs for it look like "project slug"/"item slug". Get request returns resource objects, which are described below, and is only available for /project resource. Other request objects for both resources are similar:

#### GET
```js
{slug: "slug"}
```

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
One tag is currently supported: {% project "slug" %} - render template is up to you and should be stored in /templates/projects/ folder under project.html and wall.html name.
