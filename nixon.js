var path = require('path');
var Horseman = require('node-horseman');
var horseman = new Horseman();

// patch horseman.crop

horseman.crop = function( area, path ){
  if ( typeof area === "string" ){
    area = this.boundingRectangle( area );
  } 
  var rect = {
    top : area.top,
    left : area.left,
    width : area.width,
    height : area.height
  };
  var self = this;
  this.page.set('clipRect', rect, function(){
    self.pause.unpause('clipRect');
    self.screenshot( path );
    self.page.set('clipRect', {});
    return this;
  });
  this.pause.pause('clipRect');  
}

// end patch

var imagePath = "screenshots";

var argv = require('minimist')(process.argv.slice(2));

var scriptName = argv._[0] || "example";


var script = require(path.join(__dirname, 'scripts', scriptName));

console.log('\nNixon.js - running: ' + scriptName);

// console.log('sizes', script.sizes);

if (!script.keepCookies){
	horseman.cookies([]);
}

if (!script.sizes){
	console.log('No sizes set, using default (1024px)');
	script.sizes = [{
			width: 1024
		}];
}

var numSteps = 0;
var numSizes = script.sizes.length;
var imageCount = 0;


script.steps.forEach(function(step){
	numSteps++;
	if (step.screenshotStep !== false){
		script.sizes.forEach(function(){
			imageCount++;
		});
		if (step.sizes){
			step.sizes.forEach(function(){
				imageCount++;
			});
		}
	}
});

console.log(numSteps + " steps, " + numSizes + " sizes per step");
console.log('Total screenshots:', imageCount);

var errorCount = 0;
var stepNumber = 1;
var sizeCount = 1;
var stepName = '';

var processSizes = function(size, index, array){
	var image= {};
	if ( !size.width ) {
		errorCount++;
		image.width = 1024; //default width
	} else {
		image.width = size.width;
	}
	image.height = (size.height) ? size.height : 100;
	image.name = (size.name) ? size.name : image.width;
	image.zoom = (size.zoom) ? size.zoom : 1;
	image.suffix = (size.suffix) ? size.suffix : '';
	// console.log(stepName);
	var imageName = stepNumber + '-' + stepName + '-' + image.name + image.suffix + '.png';

	// var imageName = stepNumber + '-' + image.name + image.suffix + '.png';
	var filename = path.join(imagePath, scriptName, String(image.name), imageName);
	
	horseman
		.zoom(image.zoom)
		.viewport((image.zoom * image.width), (image.zoom * image.height))
		.wait(250);
	if (size.crop) {
		console.log('\tSize', sizeCount, '-', image.name + ' (cropped):', imageName);
		image.crop = size.crop;
		if ( typeof size.crop === "string" ) {
			// Don't crop if selector doesn't exist
			if (!horseman.exists(size.crop)){
				errorCount++;
				console.warn('\tError: selector does not exist');
			}
			else {
				image.crop = size.crop;
				horseman.crop(image.crop, filename);
			}
		}
		else {
			image.crop.top = image.zoom * size.crop.top;
			image.crop.left = image.zoom * size.crop.left;
			image.crop.width = image.zoom * size.crop.width;
			image.crop.height = image.zoom * size.crop.height;
			horseman.crop(image.crop, filename);
		}
	} else {
		console.log('\tSize', sizeCount, '-', image.name + ':', imageName);
		horseman
			.screenshot(filename);
	}

	// Width error appears after screenshot
	if (!size.width){
		console.warn('\tError: width not set - using default (1024px)');
	}

	sizeCount++;
};

script.steps.forEach(function(step){

	stepName = step.name;

	console.log('\nStep ' + stepNumber + " - " + stepName);
	if (step.authentication){
		horseman.authentication(step.authentication.username, step.authentication.password);
	}
	if (step.url){
		horseman.open(step.url);
	}
	
	if (step.switchToTab){
		horseman.switchToTab(step.switchToTab);
	}
	if (step.reloadPage){
		horseman.open(horseman.url());
	}

	if (step.upload){
		horseman.upload(step.upload.selector, step.upload.path);
	}
	if (step.js){
		horseman.manipulate(step.js);
	}
	horseman.manipulate(function(){
		$('html').css({backgroundColor: '#FFFFFF'});
	}
	);
	if (step.delay){
		horseman.wait(step.delay);
	} else {
		horseman.waitForNextPage();
	}

	console.log(horseman.url());

	

	if (step.description){
		console.log('Description:', step.description);
	}
	if (step.expectedUrl) {
		if (horseman.url() != step.expectedUrl){
			errorCount++;
			console.warn('Error: expected url does not match. Expected:', step.expectedUrl);
		}
	}

	if (step.screenshotStep !== false){
		sizeCount = 1;
		script.sizes.forEach(processSizes);
		if (step.sizes){
			step.sizes.forEach(processSizes);
		}
	}


	stepNumber++;
});

horseman.close();

var errorText = (errorCount != 1) ? 'errors' : 'error';
var endMessage = (errorCount) ? (' - ' + errorCount + ' ' + errorText) : '';
console.log("\nAll done" + endMessage);