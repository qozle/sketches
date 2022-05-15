This is a newer set of sketches that I'm making, as I set out to explore the world of creating digital art.  

The ultimate goal for these sketches is to treat them as modules, along with some machine learning scripts, which will be able to be used with various 'main' scripts, which will automate running them and mixing them in combonations and set their parameters generatively.  

There are a series of older sketches I made using Vue- you can find that repository here (<a href='https://github.com/qozle/p5-sketch-book'>https://github.com/qozle/p5-sketch-book</a>).  I no longer maintain that repository. 


###  SKETCH 1  ###

This is a series of circles that rotate at independant rates.  The frames are captured as they are generated (independantly of the actual frame rate) so that they can be played back smoothly later on.  The idea was to capture the motion with a machine learning model and combine it with another sketch.  I don't know exactly what that would do, but I'm hoping it will look cool. 


###  SKETCH 2  ###

This is a remake of my 'makers versus breakers' python script that I wrote when I first started coding (https://github.com/qozle/Makers-vs.-Breakers).  Instead of bouncing balls, this uses wrapping and some more advanced physics, as well as the addition of mimicking the effect of autonomous agency.  The triangles will flock together with local neighbors but also avoid running into them.  It will also wander around on its own when it isn't flocking.  

The breaker will wander on its own as well, until it comes close to one or more regular triangles.  At that point, it will chase them and when it gets close enough, it will 'eat' the triangle, increasing its own area by the area of the triangle it ate.  It's area constatnly decreases (faster when it is larger, and slower when it is smaller).  If it dies, a new breaker will be made.

Currently, a new triangle is added every 5 seconds up until a maximum amount of triangles is reached.

The general idea is to have an interesting dynamic play out indefinitely.  