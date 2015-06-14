

module.exports = {

	username: "",
	password: "",

	// overwrite: false,

	sizes: [
		{
			name: 'mobile',
			width: 320
		},{
			name: 'desktop',
			width: 1024
		}
		// {
		//	width: '',
		//	crop: '.homepage-top-inner'
		// },
		// {
		//	name: "",
		//	width: 768,
		//	height: 768,
		//	zoom: 1,
		//	suffix: '_x2'
		// },
		// {
		//	name: "768-cropped",
		//	width: 768,
		//	height: 768,
		//	zoom: 2,
		//	suffix: 'x2',
		//	crop: {
		//		top : 100,
		//		left: 100,
		//		width: 100,
		//		height: 100
		//	}
		// }
	],

	steps : [
		{
			url: 'https://gov.uk',
			name: 'GOV.UK homepage',
			description: "GOV.UK's homepage",
			screenshotStep: true
		},{
			name: 'browse-benefits',
			sizes: [{
				name: 'browse-heading',
				width: 1024,
				crop: 'h1'
			}],
			js : function(){
				$('.categories-list a')[0].click();
			},
			expectedUrl: 'https://www.gov.uk/browse/benefits'
		}
	]
};


// steps: [
//	{
//		url: 'https://gov.uk',
//		name: 'homepage',
//		description: 'The homepage for GOV.UK',
//		upload: {
//			selector: 'input#upload-file',
//			path: '/path/to/file'
//		},
//		authentication: {
//			username: 'myUserName',
//			password: 'myPassword'
//		},
//		switchToTab: 0,
//		// Extra sizes for specific steps
//		sizes: [
//			{
//				name: 'homepage-heading',
//				width: 1024,
//				crop: 'h1'
//			}
//		],
//		js : function(){
//			$('.categories-list a')[0].click();
//		},
//		screenshotStep: true, //default
//		delay: 500, // 500ms

//		// Compared with actual url after js has run. Are we on the right page?
//		expectedUrl: 'https://gov.uk'
  	
//	},{

//	},{

//	}
// ]