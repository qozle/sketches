//  use instance mode
let sketch = function (p) {

	//  this is for capturing the frames to make them into a gif later on
	// var capturer = new CCapture({
	// 	format: 'png',
	// 	workersPath: '../ccapture/',
	// 	framerate: 60,
	// 	verbose: true,
	// 	name: 'circles'
	// });



	class Triangle {
		constructor(posx, posy, width, height) {
			this.width = p.random(10, width);
			this.height = p.random(10, height);
			this.speed = p.random(1, 5);

			this.pos = p.createVector(posx, posy);

			this.velocity = p5.Vector.random2D();

			this.acceleration = p.createVector();

			this.p1 = p.createVector(
				this.pos.x - this.width / 2,
				this.pos.y - this.height / 2
			);
			this.p2 = p.createVector(
				this.pos.x + this.width / 2,
				this.pos.y - this.height / 2
			);
			this.p3 = p.createVector(this.pos.x, this.pos.y + this.height / 2);
		}

		update(perlin) {

			//  each triangle wanders to its own noise
			p.noiseSeed(perlin);

			let randomVector = p.createVector(
				p.noise(p.frameCount) * 2 - 1,
				p.noise(p.frameCount / 2) * 2 - 1
			);

			this.velocity.add(randomVector);

			this.pos.add(this.velocity);

			//  wrap around
			if (this.pos.x >= p.width / 2 || this.pos.x <= -p.width / 2) {
				this.pos.x = -this.pos.x;
			}

			if (this.pos.y >= p.height / 2 || this.pos.y <= -p.height / 2) {
				this.pos.y = -this.pos.y;
			}

			//  update points for triangle
			this.p1.x = this.pos.x - this.width / 2;
			this.p1.y = this.pos.y - this.height / 2;
			
			this.p2.x = this.pos.x + this.width / 2;
			this.p2.y = this.pos.y - this.height / 2;

			this.p3.x = this.pos.x;
			this.p3.y = this.pos.y + this.height / 2;

			console.log('randomvector');
			console.log(randomVector);
			console.log("velocity:");
			console.log(this.velocity);
			console.log("pos");
			console.log(this.pos);
		}

		show() {
			p.push();

			p.fill(51);
			p.stroke(100);

			p.rotate(this.pos.heading);
			p.triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
			
			p.pop();


		}
  	}	


	//  array of triangles
	triangles = [];


	for (let i = 0; i < 1; i++){
		triangles.push({
			'tri': new Triangle(p.random(p.width), p.random(p.height), p.random(10, 50), p.random(10, 50)),
			'perlin': p.random(0, 10000)
		});
	}
	



	//  FIRST FRAME SETUP
	p.setup = function () {
		p.angleMode(p.DEGREES);
		p.rectMode(p.CENTER);
		p.frameRate(30);
		p.createCanvas(500, 500);
		p.noLoop();

	}


	//  DRAW LOOP
	p.draw = function () {

		p.background(255);
		p.translate(p.width / 2, p.height / 2);

		triangles.forEach((tri) => {
			tri.tri.update(tri.perlin);
			tri.tri.show();
		});


		//  capture 300 frames, stop the sketch
		// capturer.capture(document.getElementById("defaultCanvas0"));
		// if (p.frameCount === 300) {
		// 	capturer.stop();
		// 	capturer.save();
		// 	p.noLoop();
		// 	return;
		// }

	}



	
	





}

//  use instance mode.
new p5(sketch, 'container');


