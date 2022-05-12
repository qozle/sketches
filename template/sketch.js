//  use instance mode
let sketch = function (p) {

	//  GLOBAL STUFF
	const level = 7;
	const rates = [];

	//  this is for capturing the frames to make them into a gif later on
	var capturer = new CCapture({
		format: 'png',
		workersPath: '../ccapture/',
		framerate: 60,
		verbose: true,
		name: 'circles'
	});



	
	//  FIRST FRAME SETUP
	p.setup = function() {
	

	}

	//  DRAW LOOP
	p.draw = function () {


		//  capture 300 frames, stop the sketch
		capturer.capture(document.getElementById("defaultCanvas0"));
		if (p.frameCount === 300) {
			capturer.stop();
			capturer.save();
			p.noLoop();
			return;
		}

	}


}

//  use instance mode.
new p5(sketch, 'container');


