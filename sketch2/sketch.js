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
			this.maxSpeed = 8;
			this.maxWidth = this.height + p.random(-50, 51);
			this.maxHeight = this.height + p.random(-50, 51);


			
			this.pos = p.createVector(posx, posy);
			this.velocity = p.createVector().mult(0);
			this.acceleration = p.createVector().mult(0);


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

			//  increase the height and width until they're max
			if (this.width < this.maxWidth) this.width++;
			if (this.height < this.maxHeight) this.height++;


			//  each triangle wanders to its own noise
			p.noiseSeed(perlin);
			// let randomVector = p5.Vector.fromAngle(p.noiseSeed(p.frameCount) * 360);
			// randomVector.setMag(p.random(0, this.maxSpeed));

			let randomVector = p.createVector(
				(((p.noise(p.frameCount / 10) * 2) - 1) * this.speed),
				(((p.noise(p.frameCount / 10 + 1000) * 2) - 1) * this.speed)
			);

			//  add randomVector to acceleration, which should be
			//  the sum of all force vectors
			this.acceleration.add(randomVector);
			//  add acceleration to velocity
			this.velocity.add(this.acceleration);
			//  limit the speed to the max speed
			this.velocity.limit(this.maxSpeed);
			//  move the triangle
			this.pos.add(this.velocity);
			//  clear out the acceleration because it will be
			//  recalculated next frame
			this.acceleration.mult(0);


			//  wrap
			if (this.pos.x >= p.width / 2 || this.pos.x <= -p.width / 2) {
				this.pos.x = -this.pos.x;
			}

			if (this.pos.y >= p.height / 2 || this.pos.y <= -p.height / 2) {
				this.pos.y = -this.pos.y;
			}




			// console.log('randomvector');
			// console.log(randomVector);
			// console.log("velocity:");
			// console.log(this.velocity);
			// console.log("pos");
			// console.log(this.pos);
		}


		show() {
			p.push();

			// p.fill(51);
			p.noFill();
			p.stroke(100);

			p.translate(this.pos.x, this.pos.y)

			p.rotate(this.velocity.heading() - 90);

			
			//  update points for triangle
			this.p1.x = 0 - this.width / 2;
			this.p1.y = 0 - this.height / 2;

			this.p2.x = 0 + this.width / 2;
			this.p2.y = 0 - this.height / 2;

			this.p3.x = 0;
			this.p3.y = 0 + this.height / 2;

			

			p.triangle(
				this.p1.x,
				this.p1.y,
				this.p2.x,
				this.p2.y,
				this.p3.x,
				this.p3.y
			);

			p.line(0, this.height / 2, 0, -this.height / 2)

			p.pop();
		}
  	}	




	function make_triangle() {
		if (count < maxCount) {
			
			triangles.push({
				'tri': new Triangle(p.random(p.width / 2), p.random(p.height / 2), p.random(11, 51), p.random(1, 51)),
				'perlin': p.random(0, 10000)
			});

			count++;

		} else {
			clearInterval(triangle_interval);
		}

		
	}


	//  array of triangles
	var triangles = [];
	let count = 0;
	let maxCount = 50;

	make_triangle();
	triangle_interval = setInterval(make_triangle, 5000);	














	//  FIRST FRAME SETUP
	p.setup = function () {
		p.angleMode(p.DEGREES);
		p.rectMode(p.CENTER);
		p.frameRate(30);
		p.createCanvas(878, 639);
		// p.noLoop();

	}


	//  DRAW LOOP
	p.draw = function () {

		p.background(255);
		p.translate(p.width / 2, p.height / 2);
		p.angleMode(p.DEGREES);

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


