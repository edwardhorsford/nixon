# Nixon

A framework to step through a website saving screenshots, based on [Horseman](https://github.com/johntitus/node-horseman).

## You need

* [Node.js](http://node.js)
* [PhantomJS](http://phantomjs.org) - version 2 or later

## Getting started

* [Download Nixon](https://github.com/joelanman/nixon/archive/master.zip)

In the terminal run:

* `npm install`

* `node nixon`

Screenshots will be saved into a 'screenshots' folder.

## How to use

Make a copy of `scripts/example.js`, for example `scripts/blog.js`

You can now run this script:

`node nixon blog`

Script options:

### sizes
An array of objects containing the sizes and settings we want for our screenshots.

*Type:* `Array`<br />
*Default:* `[{ width: 1024}]`<br />

For example:
```js
sizes: [{
	width: 320
},{
	name: "iPad",
	width: 768
}]
```

Sizes settings are as follows:

* **crop**<br />
	*Type:* `string` or `bounding rectangle`<br />
	*Default:* `no crop`<br />

	Use `crop` to screenshot an area of the page. You can pass in either a CSS selector or a boundingRectangle `{ top : 50, left: 200, width: 90, height: 200 }`.

	For example:
	```js
	sizes: [{
		name: 'square-crop'
		width: 1024
		crop: {
			top: 100,
			left: 100,
			width: 100,
			height: 100
		}
	},{
		name: "page-h1",
		width: 1024,
		crop: 'h1'
	}]
	```
	Note: `boundingRectangle` scales with zoom, but `selector` does not.
	
* **height**<br />
	*Type:* `Number`<br />
	*Default:* `100`<br />

	`height` is set in pixels. Note that height is normallly ignored - screenshots will be the height of the content.	

* **name**<br />
	*Type:* `String`<br />
	*Default:* `size width`<br />

	If a `name` is specified, then the file will be suffixed with this name. e.g. `1-start-page-iPad.png`.<br />
	If a `name` is not specified, then the file will be suffixed with the width. e.g. `1-start-page-768.png`.

* **suffix**<br />
	*Type:* `String`<br />
	*Default:* `none`<br />

	Use `suffix` for retina graphic filenames. e.g. `1-start-page-768_x2.png`

* **width**<br />
	*Type:* `Number`<br />
	*Default:* `1024`<br />

	`width` is set in pixels. This is the only option that should be set. If no `name` is specified, the `width` will be used in the image filename.

* **zoom**<br />
	*Type:* `number`<br />
	*Default:* `1`<br />

	Use `zoom` to set the amount of zoom on the page. Can be used to capture retina graphics with a setting of `zoom: 2`. Note the `width` and `height` are scaled by the zoom setting. For example, for an image of `width: 1024` and `zoom: 2`, the captured width will be 2048.
	
	**Complex sizes example**<br />
	This example will take a screenshot of the page at iPhone resolution - both retina and not. It will also capture the page h1 and top 100px of the page.
	```js
	sizes: [
		{
			name: 'iPhone-2',
			width: 320
		},{
			name: "iPhone-3g",
			width: 320,
			// 2x scale for retina
			zoom: 2,
			suffix: '_x2'
		},{
			name: 'page-h1'
			width: 1024,
			// Crop h1 out of page
			crop: 'h1'
		},{
			name: 'top-100px'
			width: 1024,
			// Crop top 100px out of page
			crop: {
				top: 0,
				left: 0,
				width: 1024,
				height: 100
			}
		}
	]
```

### steps
An array of objects - each object is a step for Nixon to run through. At the end of each step Nixon will take a screenshot (unless explicitly told not to).

Steps can be chained from one to another by interacting with elements on the page.

*Type:* `Array`<br />
*Default:* `none`<br />

For example:
```js
steps: [
	{
		// Load the GOV.UK homepage
		url: 'https://www.gov.uk/',
		name: 'govuk-homepage'
	},{
		// Navigate to benefits browse page
		name: 'browse-benefits',
		// Click first anchor in browse list
		js : function(){
			$('.categories-list a')[0].click();
		}
	}
]
```

Step settings are as follows:

* **authentication**<br />
	*Type:* `Object`<br />
	*Default:* `no authentication`<br />

	Used to log in with basic authenticaion. An object with keys `username: 'myUsername'` and `password: 'myPassword'`. May be useful if navigating between multiple authenticated prototypes within a single set of steps.

	```js
	authentication: {
		username: 'myUsername',
		password: 'myPassword'
	}
	```
	
* **delay**<br />
	*Type:* `Number`<br />
	*Default:* `waitForNextPage()`<br />

	Number of `ms` to wait before taking screenshot. If not provided, Nixon will wait for a page load before screenshotting.
	```js
	// 0.5s delay
	delay: 500
	```
	
* **description**<br />
	*Type:* `String`<br />
	*Default:* `none`<br />

	A description of the page being screenshotted. Only used in console output currently, but in future could form part of a self-documenting resource.
	```js
	description: 'This is the description'
	```
	
* **expectedUrl**<br />
	*Type:* `String`<br />
	*Default:* `none`<br />

	The `url` that the step expects to be on. Nixon will compare this with the actual url and warn if they don't match. Useful for debugging if javascript has navigated to the wrong page.
	```js
	// Expect to be taking a screenshot on GOV.UK browse
	expectedUrl: 'https://www.gov.uk/browse'
	```

* **js**<br />
	*Type:* `function`<br />
	*Default:* `none`<br />

	Javascript (jQuery as well) inside this function will be run on the target page. Useful for filling in form fields or navigating around. Note - after navigating to a new page, no further javascript will run. If you wish to continue navigating (without taking a screenshot), create a new step with `screenshotStep: false` and further `js` in that step.
	```js
	// js to run in page
	js: function(){
		// Click on first anchor in categories-list
		$('.categories-list a')[0].click();
	}
	```
	
* **name**<br />
	*Type:* `String`<br />
	*Default:* `none`<br />

	`name` for the current step. `name` is used in the image filename to identify the step.
	```js
	name: 'homepage'
	```
	
* **reloadPage**<br />
	*Type:* `Boolean`<br />
	*Default:* `false`<br />

	Reload the page before taking screenshot. Useful if page has a 'cookie' banner which would otherwise appear if it's the first visit by the browser.
	```js
	reloadPage: true
	```
	
* **screenshotStep**<br />
	*Type:* `Boolean`<br />
	*Default:* `true`<br />

	Set to `false` to prevent the current step being screenshotted. Useful if using the step to navigate around but a screenshot is not needed.
	```js
	// Switch to first tab
	screenshotStep: false
	```
	
* **sizes**<br />
	*Type:* `Array`<br />
	*Default:* `none`<br />

	Array of objects. Sizes to screenshot for this step **only**. Follows the same syntax as global **sizes**. Useful if a specific size or crop is needed for a single page only. Note - this is in **addition** to sizes already defined.
	```js
	sizes: [
		{
			// Crop the h1 out of this page only
			name: 'browse-heading',
			width: 1024,
			crop: 'h1'
		}
	]
	```
	
* **switchToTab**<br />
	*Type:* `Number`<br />
	*Default:* `none`<br />

	Switch to a specified tab. The first tab is tab `0`. Useful if new windows have been spawned whilst going through the steps.
	```js
	// Switch to first tab
	switchToTab: 0
	```
	
* **upload**<br />
	*Type:* `Object`<br />
	*Default:* `none`<br />

	Used to upload a file to the webpage. An object with keys `selector: 'pageSelector'` and `path: '/path/to/file'`. Note - you will likely also need to use javascript on the page to submit the file.
	
	```js
	upload: {
		selector: 'input#upload-file',
		path: '/path/to/file'
	}
	```
	
* **url**<br />
	*Type:* `String`<br />
	*Default:* `previous url`<br />

	`url` to navigate to at start of step. If no url is provided, the step follows on from the `url` of the previous step.
	```js
	url: 'https://www.gov.uk/'
	```

	**Complex steps example**<br />
	
	```js
	steps: [
		{
			// First step sets a starting url
			url: 'https://www.gov.uk/',
			name: 'homepage',
			description: 'The homepage of GOV.UK',
			// Reload page so that cookie bar goes away
			reloadPage: true,
			// Take a screenshot of the header for this step only
			sizes: [
				{
					name: 'homepage-heading',
					width: 1024,
					// Crop takes a selector or bounding box
					crop: '.homepage-top'
				}
			]
		},{
			name: 'browse-benefits',
			description: 'Benefits section of browse',
			// Click on first anchor of homepage to take Nixon to browse-benefits
			js : function(){
				$('.categories-list a')[0].click();
			},
			// Compare the page we arrived at with the expected url
			expectedUrl: 'https://www.gov.uk/browse/benefits'
		},{
			// Want to get to 'apply for universal credit' but go via browse page
			name: 'browse-benefits-entitlement'
			js : function(){
				// Click first link in benefits section
				$('#section a')[0].click();
			},
			// We don't want to screenshot this page
			screenshotStep: false,
			expectedUrl: 'https://www.gov.uk/browse/benefits/entitlement'
		},{
			name: 'apply-universal-credit'
			description 'Universal credit start page',
			js : function(){
				// Click first link in benefits section
				$('#subsection a')[1].click();
			},
			expectedUrl: 'https://www.gov.uk/apply-universal-credit'
		}
	]
	```

