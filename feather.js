
class Engine {
  constructor(width, height, bucketSize) {
    this.width = width;
    this.height = height;
    this.bucketSize = bucketSize;
    this.agents = [];
    this.buckets = {};
  }

  update() {
    //preClear(this.agents); //Update or move agents
    for(let i in this.agents) {
      this.agents[i].processLocale();
    }
    for(let i in this.agents) {
      this.agents[i].update();
    }
    this.clearBuckets();
    //popManage(this.agents); //Add or remove agents at this point
    this.rehash(); //Rehash the agents
    this.updateLocales();
    //postClear(this.agents); //Agent state transitions
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
    this.agents.forEach(this.add);
  }

  //May want to put this ouside the class
  updateLocales() {
    for(let agent of this.agents) {
      agent.locale = this.inround(agent.pos, agent.species.range);
      //I'm not filtering out the agent itself because
      //most response vectors are either zero or would produce
      //a steady state
    }
  }

  inround(pos, radius) {
    var selected = this.roughrect(pos, radius, radius);
    return selected.filter(function(agent) {
      return p5.Vector.sub(agent.pos, pos).magSq() < range**2;
    });
  }

  inrect(pos, xrange, yrange) {
    var selected = this.roughrect(pos, xrange, yrange);
    return selected.filter(function(agent) {
      return (agent.pos.x > pos.x - xrange) && (agent.pos.x < pos.x + xrange)
          && (agent.pos.y > pos.y - yrange) && (agent.pos.y < pos.y + yrange);
    });
  }

  //All agents roughly in a rectangle
  roughrect(pos, xrange, yrange) {
    //Create upper and lower rectangle corners
    var offset = sim.createVector(-xrange, -yrange);
    var [lx, ly] = this.hashPair(p5.Vector.add(pos, offset));
    offset.mult(-1);
    var [ux, uy] = this.hashPair(p5.Vector.add(pos, offset));
    //Add all from the buckets between upper bucket and lower bucket
    var selected = [];
    for( ; lx <= ux; lx++) {
      for( ; ly <= uy; ly++) {
        var cur = this.hashBucket(lx + ',' + ly);
        if(cur.length != 0) {
          selected.push(...cur); //Spread operator
        }
      }
    }
    return selected;
  }

  nearest(pos, range) {
    var consider = this.inrect(pos, range, range);
    if(consider.length == 0) {
      return null;
    }
    else if(consider.length == 1) {
      return consider[0];
    }
    var mindist = range**2;
    var closest = consider[0];
    for(var agent of consider) {
      var dist = p5.Vector.sub(agent.pos, pos).magSq();
      if(dist < mindist) {
        mindist = dist;
        closest = agent;
      }
    }
    return closest;
  }

  hashBucket(key)
  {
    if(this.buckets[key]) {
      return this.buckets[key];
    } else {
      return [];
    }
  }

  hashPair(pos) {
    return [Math.trunc(pos.x/this.bucketSize), Math.trunc(pos.y/this.bucketSize)];
  }

  //Use to add a new object
  add(object)
  {
    this.clamp(object); //Sanitize the object for use in environment
    this.agents.push(object);
    this.insert(object);
  }

  //Method to insert a prexisitng "sanitized" object
  insert(object) {
    var [x, y] = this.hashPair(object.pos);
    var key = x + ',' + y;
    if(this.buckets[key]) {
      this.buckets[key].push(object);
    } else {
      this.buckets[key] = [object];
    }
  }

  //Clamp the object inside of the environment
  clamp(object)
  {
    if(object.pos.x < 0) {
      object.pos.x = 0;
    } else if(object.pos.x > this.width) {
      object.pos.x = this.width;
    }
    if(object.pos.y < 0) {
      object.pos.y = 0;
    } else if(object.pos.y > this.height) {
      object.pos.y = this.height;
    }
  }

  remove(object) {
    var index = this.agents.indexOf(object);
    if(index > -1) {
      this.agents.splice(index, 1)
    }
  }
}

class Behavior {
  constructor() {
    this.avoid = 1.0/4;
    this.stick = 1.0/4;
    this.align = 1.0/4;
    this.wandr = 1.0/4;
  }
}

//Transition conditions for a species is some type of function
class Transition {
  constructor(filter, species) {
    this.condition = filter;
    this.endstate = species;
  }
}

//Eventually this will need to also be/link to a document elemnent
//so that we can interact with these variables
class Species {
  constructor() {
    this.size = 5;
    this.range = 20;
    this.inter = {};
    this.trans = [new Behavior]; //<-- NOTE: this is temperary
  }

  analyze(locale) { //TODO: finish this stuff
    var satisfied = false;
    for(var i = 0; i < this.trans.length && !satisfied; i++) {

    }
  }
}

class Agent {
  constructor(x, y, species) {
    this.pos = sim.createVector(x, y);
    this.vel = sim.createVector();
    this.acc = sim.createVector();
    this.species = species;
    this.locale = [];
  }

  show(canvas) {
    canvas.ellipse(this.pos.x, this.pos.y, species.size, species.size);
  }

  processLocale() {
    var sorted = {};
    for(let agent of locale) {
      if(sorted[agent.species]) {
        sorted[agent.species].push(agent);
      } else {
        sorted[agent.species] = [agent];
      }
    }
    for(let [key, pair] of ) //TODO: I can't do this right now i don't rmember how
  }

  update() {
    vel.add(pos);
    pos.add(vel);
  }
}

//New canvases using p5 instance mode to allow for multiple sketches
var simulationSketch = function(p)
{
  var engine;
  var species;
  p.setup = function()
  {
    p.createCanvas(640, 480); //Setup the canvas in the element passed in
    engine = new Engine(p.height, p.width, 10);
    species = [new Species];
    for(var i = 0; i < 100; i++) {
      engine.add(new Agent(p.random(0, p.width), p.random(0, p.height), species[0]));
    }
  }

  p.draw = function()
  {
    engine.update();
  }
}
//Put the sketch in the element with the ID here
var sim = new p5(simulationSketch, 'sketch-holder');

var cohesionVector = function(focus, agents) {
  var vect = sim.createVector();
  for(let ag of agents) {
    vect.add(ag.pos);
  }
  vect.divide(agents.length); //Vect is the centroid
  vect.sub(focus.pos); //Vect points from focus to centroid
  vect.normalize();
  return vect;
}

var seperationVector = function(agent, agents) {
  var vect = sim.createVector();
  for(let ag of agents) {
    var sep = p5.Vector.sub(focus.pos, ag.pos);
    sep.normalize();
    vect.add(sep);
  }
  vect.normalize();
  return vect;
}

var alignmentVector = function(agent, agents) {
  var vect = sim.createVector();
  for(let ag of agents) {
    var dir = sim.;
  }
  return vect;
}

var wanderVector = function(agent, range) {
  var vect = p5.Vector.fromAngle(agent.vel.heading() + sim.random(-range, range));
  return vect;
}

var toggleView = function(subject)
{
  subject.canvas.hidden = !subject.canvas.hidden;
}
