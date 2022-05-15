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



	/*  
	Behaviors:
		-  'Wander' -- Adds perlin vector to acceleration

		-  'Flock'  -- Stay close to others, align to average velocity

		-  'Avert'  -- Avoid collision
	*/


	
	//  array of triangles
	let triangles = [];
	let breakers = [];
	let numTriangles = 0;
	let maxCount = 35;


	
	
	
	
	
	//  FIRST FRAME SETUP
	p.setup = function () {

		p.angleMode(p.DEGREES);
		p.rectMode(p.CENTER);
		p.frameRate(30);
		p.createCanvas(window.innerWidth, window.innerHeight);
		// p.noLoop();
		

		//  not sure where else to declare this because we're in instanced mode...
		class Triangle {
			constructor(posx = p.random(p.width / 2), posy = p.random(p.height / 2), width = 1, height = 1) {
				this.width = p.random(10, width);
				this.height = p.random(10, height);
				this.maxSpeed = 4;
				this.maxForce = 1;
				this.maxWidth = this.height + p.random(15);
				this.maxHeight = this.height + p.random(15);
				this.perlin = p.random(10000);
				this.doWander = true;
				this.pRadius = p.random(125);
				this.safeRadius = p.random(30, 60);
				this.isAvoiding = false;
				this.isFlockng = false;



				
				this.pos = p.createVector(posx, posy);
				this.vel = p.createVector().mult(0);
				this.accel = p5.Vector.random2D();


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


			edges() {
				//  wrap
				if (this.pos.x > p.width / 2) this.pos.x = -p.width / 2;
				else if (this.pos.x < -p.width / 2) this.pos.x = p.width / 2;
	
				if (this.pos.y > p.height / 2) this.pos.y = -p.height / 2;
				else if (this.pos.y < -p.height / 2) this.pos.y = p.height / 2;				
			}


			grow() {
				//  increase the height and width until they're max
				if (this.width < this.maxWidth) this.width += .5;
				if (this.height < this.maxHeight) this.height += .5;
			}

			update(snapshot) {

				this.grow();
				this.edges();
				

				//  update acceleration with behavioural forces
				this.accel.add(this.wander());
				this.accel.add(this.flock(snapshot));
				this.accel.add(this.avoid(snapshot));

				//  add accel to velocity, make sure it doesn't go faster than max speed
				this.vel.add(this.accel);
				this.vel.limit(this.maxSpeed);

				//  update position
				this.pos.add(this.vel);

				//  clear out the acceleration because it will be recalculated next frame
				this.accel.mult(0);
			}


			//  veer from original vector
			wander() {

				if (this.doWander == false) return p.createVector().mult(0);

				//  each triangle wanders to its own noise
				p.noiseSeed(this.perlin);
				
				//  get 'random' vector from particular perlin series
				let force = p.createVector(
					((p.noise(p.frameCount / 1000) * 2) - 1),
					((p.noise(p.frameCount / 1000 + 1000) * 2) - 1)
				);


				//  set magnitude (strength of the force?)
				force.setMag(this.maxSpeed);
				force.limit(this.maxForce);

				return force;
			}


			flock(snapshot) {

				//  align, cohesive

				//  radius to flock to / with ("perception radius")
				let count = 0;
				let force = p.createVector();

				//  align
				snapshot.forEach((tri) => {

					//  don't update by our own vectors
					if (tri == this) return;

					//  have to create temp vals for pos because we're going to handle wrapping
					let targetX = tri.pos.x;
					let targetY = tri.pos.y;

					//  to deal with wrapping, we'll figure out the normal distance
					//  and the wrapped distance and use the shorter of the two
					let distX = Math.abs(this.pos.x - tri.pos.x);
					let distY = Math.abs(this.pos.y - tri.pos.y);

					//  if either distance is greater than half the width / height, then 
					//  pretend the the target is past the boundary for vector purposes
					if (distX > p.width / 2) {
						if (this.pos.x >= 0) targetX = p.width / 2 - targetX;
						else targetX = -p.width / 2 - targetX;
					}

					if (distY > p.height / 2) {
						if (this.pos.y >= 0) targetY = p.height / 2 - targetY;
						else targetY = -p.height / 2 - targetY
					}


					//  distance
					let dist = p.dist(this.pos.x, this.pos.y, targetX, targetY);


					if (dist <= this.pRadius) {
						force.add(tri.vel);
						count++;
					}

				});

				if (count) {
					this.isFlocking = true;
					this.doWander = false;
					force.div(count);
					force.setMag(this.maxSpeed);
					force.sub(this.vel);
					force.limit(this.maxForce);
					return force;
				} else {
					this.isFlocking = false;
					this.doWander = true;
					force.mult(0);
					return force.mult(0);
				}
			}


			avoid(snapshot) {

				let force = p.createVector();
				let count = 0;
				
				snapshot.forEach((tri) => {

					//  don't update by our own vectors
					if (tri == this) return;

					//  have to create temp vals for pos because we're going to handle wrapping
					let targetX = tri.pos.x;
					let targetY = tri.pos.y;

					//  to deal with wrapping, we'll figure out the normal distance
					//  and the wrapped distance and use the shorter of the two
					let distX = Math.abs(this.pos.x - tri.pos.x);
					let distY = Math.abs(this.pos.y - tri.pos.y);

					//  if either distance is greater than half the width / height, then 
					//  pretend the the target is past the boundary for vector purposes
					if (distX > p.width / 2) {
						if (this.pos.x >= 0) targetX = p.width / 2 - targetX;
						else targetX = -p.width / 2 - targetX;
					}
					
					if (distY > p.height / 2) {
						if (this.pos.y >= 0) targetY = p.height / 2 - targetY;
						else targetY = -p.height / 2 - targetY
					}

					//  how far to actually keep away.  we estimate a radius around the triangle
					//  by whichever is larger, it's width or height.  it *should* be within the 
					//  radius calculated.
					let keepDist = this.width > this.height ? this.width + this.safeRadius : this.height + this.safeRadius;

					//  distance, center to center
					let dist = p.dist(targetX, targetY, this.pos.x, this.pos.y);

					if (dist <= keepDist) {
						//  'desired' vector
						let diff = p5.Vector.sub(this.pos, p.createVector(targetX, targetY));
						//  set the 'weight'?  squared inverse force from distance
						diff.div(dist * dist);
						force.add(diff);
						count++;
					}

				});
				

				if (count) {
					force.div(count);
					force.setMag(this.maxSpeed);
					force.sub(this.vel);
					force.limit(.3);
					this.isAvoiding = true;
				}
				else {
					force.mult(0);
					this.isAvoiding = false;
				}


				return force;
			}



			show(red = 50, green = 50, blue = 50) {
				p.push();

				// let red = this.doWander ? 200 : 0;
				// let green = this.isAvoiding ? 200 : 0;
				// let blue = this.isFlocking ? 200 : 0;
				// p.noFill();

				if (breakers.length && triangles.indexOf(this) == breakers[0].target) {
					blue = 200;
					green = 200;
				}

				//  red if wandering, blue if flocking
				p.fill(red, green, blue);

				p.stroke(100);

				//  translate to the position of the triangle
				p.translate(this.pos.x, this.pos.y)

				//  so the upper point is facing the 
				p.rotate(this.vel.heading() - 90);

				
				//  update points for triangle
				this.p1.x = 0 - this.width / 2;
				this.p1.y = 0 - this.height / 2;

				this.p2.x = 0 + this.width / 2;
				this.p2.y = 0 - this.height / 2;

				this.p3.x = 0;
				this.p3.y = 0 + this.height / 2;
				

				p.triangle(
					//  p1
					this.p1.x,
					this.p1.y,
					//  p2
					this.p2.x,
					this.p2.y,
					//  p3
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

				// p.stroke(0, 0, 255);
				// p.circle(0, 0, (this.height + this.width));



				p.pop();
			}
		}	




		class Breaker extends Triangle {

			constructor(posx, posy, width, height) {
				super(posx, posy, width, height);

				this.target = null;
				this.targetRange = 100;
				this.maxSpeed = 5;


			}

			update(snapshot) {

				//  constantly shrink, faster if it's bigger, slower if it's smaller
				if (this.height > 50) this.maxHeight -= .3;
				else if (this.height < 10) this.maxHeight -= .01
				else this.maxHeight -= .03;

				if (this.width > 50) this.maxWidth -= .3;
				else if (this.width < 10) this.maxWidth -= .01
				else this.maxWidth -= .03;

				//  manage size
				this.grow();
				//  manage edges
				this.edges();

				// console.log(this.width, this.height);


				//  if you don't have a target, try to get a target
				if (this.target == null) {
					this.target = this.getTarget(snapshot);
					this.accel.add(this.wander());
				} else {
					this.accel.add(this.seek(snapshot));
				}

				//  determine accel, move
				this.vel.add(this.accel);
				this.vel.limit(this.maxSpeed);
				this.pos.add(this.vel);
				//  clear accel bc it's recalculated every time
				this.accel.mult(0);
			}


			getTarget(snapshot) {

				let targets = [];
				
				for (let i = 0; i < snapshot.length; i++){

					let tri = snapshot[i];

					//  have to create temp vals for pos because we're going to handle wrapping
					let targetX = tri.pos.x;
					let targetY = tri.pos.y;

					//  to deal with wrapping, we'll figure out the normal distance
					//  and the wrapped distance and use the shorter of the two
					let distX = Math.abs(this.pos.x - tri.pos.x);
					let distY = Math.abs(this.pos.y - tri.pos.y);

					//  if either distance is greater than half the width / height, then 
					//  pretend the the target is past the boundary for vector purposes
					if (distX > p.width / 2) {
						if (this.pos.x >= 0) targetX = p.width / 2 - targetX;
						else targetX = -p.width / 2 - targetX;
					}
					
					if (distY > p.height / 2) {
						if (this.pos.y >= 0) targetY = p.height / 2 - targetY;
						else targetY = -p.height / 2 - targetY
					}

	
				
					let dist = p.dist(this.pos.x, this.pos.y, targetX, targetY);
	
					if (dist <= this.targetRange) {

						//  add to potential targets
						targets.push(i)
					}
				}

				if (targets.length) {
					//  target is an index of snapshot
					return targets[Math.floor(Math.random() * targets.length)];					
				} else {
					return null;
				}
			}



			seek(snapshot) {
				let target = snapshot[this.target];

				let range = this.height > this.width ? this.height / 2 : this.width / 2;

				//  have to create temp vals for pos because we're going to handle wrapping
				let targetX = target.pos.x;
				let targetY = target.pos.y;

				//  to deal with wrapping, we'll figure out the normal distance
				//  and the wrapped distance and use the shorter of the two
				let distX = Math.abs(this.pos.x - target.pos.x);
				let distY = Math.abs(this.pos.y - target.pos.y);

				console.log(distX, distY);

				//  if either distance is greater than half the width / height, then 
				//  pretend the the target is past the boundary for vector purposes
				if (distX > p.width / 2) {
					if (this.pos.x >= 0) targetX = p.width / 2 - targetX;
					else targetX = -p.width / 2 - targetX;
				}
				
				if (distY > p.height / 2) {
					if (this.pos.y >= 0) targetY = p.height / 2 - targetY;
					else targetY = -p.height / 2 - targetY
				}



				//  'eat' target
				if (p.dist(this.pos.x, this.pos.y, targetX, targetY) < range) {
					//  remove triangle from triangles array
					triangles.splice(this.target, 1);
					numTriangles--;

					//  increase max width and height so it'll grow a bit bigger
					this.maxWidth += target.width;
					this.maxHeight += target.height;

					//  empty the target so it'll find a new one
					this.target = null;

					//  make a new random seed so we go in a different direction
					this.perlin = p.random(10000);

					//  return 0'd vector
					return p.createVector().mult(0);

				} else {
					//  chase target
					let force = p5.Vector.sub(p.createVector(targetX, targetY), this.pos);
					force.setMag(this.maxSpeed);
					force.sub(this.velocity);
					force.limit(this.maxForce);
					return force;
				}


			}

			//  constantly shrink so it doesn't get huge.
			grow() {

				
				if (this.width < this.maxWidth) this.width += .5;
				if (this.height < this.maxHeight) this.height += .5;


				if (this.width > this.maxWidth) this.width -= .05;

				if (this.height > this.maxHeight) this.height -= .05;

				//  die if we get too small
				if (this.width <= 0 || this.height <= 0) {
					breakers.splice(breakers.indexOf(this), 1);
					breakers.push(new Breaker());
				}

			}

		}
		







		//  make a new triangle every interval until we hit maxcount
		function make_triangle() {
			if (numTriangles < maxCount) {
				triangles.push(new Triangle());
				numTriangles++;
			}
		}


		//  make a breaker
		for (let i = 0; i < 5; i++){
			make_triangle();
		}

		breakers.push(new Breaker())

		triangle_interval = setInterval(make_triangle, 5000);	



	}


	//  DRAW LOOP
	p.draw = function () {

		



		p.background(0, 50, 225);
		p.translate(p.width / 2, p.height / 2);
		p.angleMode(p.DEGREES);

		if (breakers.length == 0) breakers.push(new Breaker());

		//  get our snapshots before we update anything
		snapshot = triangles;
		b_snapeshot = breakers;

		triangles.forEach((triangle) => {
			triangle.update(snapshot);
			triangle.show();
		});

		breakers.forEach((breaker) => {
			breaker.update(snapshot);
			breaker.show(255, 0, 0);
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



	//  RESIZE CANVAS TO WINDOW SIZE
	p.windowResized = function () {
		p.resizeCanvas(window.innerWidth, window.innerHeight);
	}


}

//  use instance mode.
new p5(sketch, 'container');


