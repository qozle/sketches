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
			this.speed = p.random() + 1;
			this.maxSpeed = 8;
			this.maxWidth = this.height + p.random(50);
			this.maxHeight = this.height + p.random(50);
			this.perlin = p.random(10000);


			
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

		update() {

			//  increase the height and width until they're max
			if (this.width < this.maxWidth) this.width++;
			if (this.height < this.maxHeight) this.height++;

			
			//  add acceleration to velocity
			this.velocity.add(this.acceleration);
			//  normalize
			// this.velocity.normalize();
			//  add speed
			// this.velocity.mult(this.speed);
			//  limit the speed to the max speed
			this.velocity.limit(this.maxSpeed);
			//  move the triangle
			this.pos.add(this.velocity);
			//  clear out the acceleration because it will be recalculated next frame
			this.acceleration.mult(0);


			//  wrap
			if (this.pos.x + this.width / 2 >= p.width / 2 || this.pos.x - this.width / 2 <= -p.width / 2) {
				this.pos.x = -this.pos.x;
			}

			if (this.pos.y + this.height / 2 >= p.height / 2 || this.pos.y - this.height / 2 <= -p.height / 2) {
				this.pos.y = -this.pos.y;
			}

		}


		perlinForce() {

			//  each triangle wanders to its own noise
			p.noiseSeed(this.perlin);

			let randomVector = p.createVector(
				(((p.noise(p.frameCount / 25) * 2) - 1) * this.speed),
				(((p.noise(p.frameCount / 25 + 1000) * 2) - 1) * this.speed)
			);

			//  add randomVector to acceleration, which should be
			//  the sum of all force vectors
			this.acceleration.add(randomVector);
		}


		averse() {
			
			triangles.forEach((tri) => {
				let centerDist = p.dist(tri.pos.x, tri.pos.y, this.pos.x, this.pos.y);
				let keepDist = tri.width + tri.height + this.width + this.height;

				if (centerDist <= keepDist) {

					//  create a vector pointing away from the point
					let averseV = p5.Vector.fromAngle(this.pos.angleBetween(tri.pos));
					averseV.setMag(p.map(centerDist, keepDist, 0, 0, this.maxSpeed));
		
					this.acceleration.sub(averseV);

				}
	
			});
		}



		show() {
			p.push();

			p.noFill();
			p.stroke(100);

			//  translate to the position of the triangle
			p.translate(this.pos.x, this.pos.y)

			//  so the upper point is facing the 
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

			// p.fill(255, 0, 0);
			// p.circle(0, 0, 5)
			
			// //p1 BLUE bottom left
			// p.stroke(0, 0, 255);
			// p.circle(this.p1.x, this.p1.y, this.height + this.width);

			// //p2 GREEN bottom right
			// p.stroke(0, 255, 0);
			// p.circle(this.p2.x, this.p2.y, this.height + this.width);

			// //p3 PURPLE top
			// p.stroke(255, 0, 255);
			// p.circle(this.p3.x, this.p3.y, this.height + this.width);

			p.stroke(0, 0, 255);
			p.circle(0, 0, (this.height + this.width));



			p.pop();
		}
  	}	




	function make_triangle() {
		if (count < maxCount) {
			
			triangles.push(new Triangle(p.random(p.width / 2), p.random(p.height / 2), 1, 1));

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

		triangles.forEach((triangle) => {
			triangle.averse();
			triangle.perlinForce();
			triangle.update();
			triangle.show();
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


