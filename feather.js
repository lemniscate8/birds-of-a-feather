
class Engine {
  constructor(width, height, bucketSize) {
    this.width = width;
    this.height = height;
    this.bucketSize = bucketSize;
    this.agents = [];
    this.buckets = {};
  }

  clearBuckets() {
    let key;
    for(key in this.buckets) {
      //If the bucket was empty remove
      if(this.buckets[key].length == 0) {
        delete this.buckets[key];
      } else { //Otherwise, just clear its contents
        this.buckets[key] = [];
      }
    }
  }

  rehash() {
    for(let agent of this.agents) {
      add(agent);
    }
  }

  updateLocales() {
    for(let agent of this.agents) {
      agent.locale = []; //Clear the current locale
      var [lx, ly] = hashPair(agent.pos.add(createVector(-species.range, -species.range)));
      var [ux, uy] = hashPair(agent.pos.add(createVector(species.range, species.range)));
      for(lx; lx <= ux; lx++) {
        for(ly; ly < uy; ly++) {
          //Let's see if the spread operator works (what is this witchcraft)
          agent.locale.push(...this.buckets[lx + ',' + ly]);
        }
      }
      //TODO: Now cull the edges (the region is circular)

    }
  }

  hashPair(pos) {
    return [Math.trunc(pos.x/this.bucketSize), Math.trunc(pos.y/this.bucketSize)];
  }

  add(object) {

  }

  remove(object) {

  }

}

class Agent {
  constructor(x, y, species) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.species = species;
    this.locale = [];
  }

  show(canvas) {
    canvas.ellipse(this.pos.x, this.pos.y, species.size, species.size);
  }

  roi() {
    return new ROI(this.pos, this.species.range);
  }
}



//Eventually this will need to also be/link to a document elemnent
//so that we can interact with these variables
class Species {
  constructor() {
    this.size = 5;
    this.range = 10;

  }
}

class ROI {
  constructor(pos, radius) {
    this.pos = createVector(pos);
    this.radius = radius;
  }
}

//New canvases using p5 instance mode to allow for multiple sketches
var simulationSketch = function(p)
{
  p.setup = function()
  {
    p.createCanvas(640, 480); //Setup the canvas in the element passed in
    p.canvas.hidden = true;
  }

  p.draw = function()
  {
    //Temporary testing code
    if(p.mouseIsPressed)
      p.ellipse(p.mouseX, p.mouseY, 80, 80);
  }
}
//Put the sketch in the element with the ID here
var sim = new p5(simulationSketch, 'sketch-holder');


var toggleView = function(subject)
{
  subject.canvas.hidden = !subject.canvas.hidden;
}
