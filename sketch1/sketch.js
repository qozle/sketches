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

	//  create random rotation rates for each circle
	for (i = 0; i <= level; i++){
		rates[i] = [];
		rates[i]["a"] = p.random(0, 180);
		rates[i]["b"] = p.random(0, 180);
	}

	// console.log(rates);


	
	//  FIRST FRAME SETUP
	p.setup = function() {
		p.createCanvas(720, 560);
		// p.noStroke();
		p.angleMode(p.DEGREES);
		// p.noLoop();
		p.frameRate(60);
	}

	//  DRAW LOOP
	p.draw = function () {
		//  start capturing.  can't put this in setup, known bug
		if (p.frameCount === 1) capturer.start();

		p.clear()
		p.translate(p.width / 2, p.height / 2);
		p.rotate((p.frameCount  + rates[6]["a"]) % 360);
		drawCircle(0, 280, level);


		//  capture 300 frames, stop the sketch
		capturer.capture(document.getElementById("defaultCanvas0"));
		if (p.frameCount === 300) {
			capturer.stop();
			capturer.save();
			p.noLoop();
			return;
		}

	}

	//  ...draw circle
	function drawCircle(x, radius, level) {

		const tt = (126 * level) / 4.0;
		p.fill(tt);
		p.ellipse(x, 0, radius * 2, radius * 2);
		
		if (level > 1) {
			level = level - 1;
			
			p.push();
			p.translate(x - radius / 2, 0);
			p.rotate((p.frameCount + rates[level]["a"]) % 360);
			drawCircle(0, radius / 2, level);
			// p.line(0, -radius / 2, 0, radius / 2);
			p.pop();
			
			p.push();
			p.translate(x + radius / 2, 0);
			p.rotate((p.frameCount + rates[level]["b"]) % 360);
			drawCircle(0, radius / 2, level);
			// p.line(0, -radius / 2, 0, radius / 2);
			p.pop();			
		}		


	}

}

//  use instance mode.
new p5(sketch, 'container');


