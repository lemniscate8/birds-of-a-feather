/**
 *  @fileOverview Classes for Behavior, Species and Agent as well
 *  as core vector math
 *
 *  @author       Tait Weicht
 */

/**
* A class representing a specific behavior pattern width
* the four fundamental responses needed to create flocking
* @class
*/
class Behavior {


  /**
   * constructor - description
   *
   * @param  {number} [c = 5] Cohesion weight
   * @param  {number} [s = 5] Avoidance weight
   * @param  {number} [a = 5] Alignment weight
   * @param  {number} [w = 5] Wandering weight
   * @return {Behavior}       A behavior object
   */
  constructor(c = 5, s = 5, a = 5, w = 5) {
    this.stick = c;
    this.avoid = s;
    this.align = a;
    this.wandr = w;
  }


  /**
   * process - function to averate a set of vectors based on the weights
   * in the Behavior
   *
   * @param  {p5.Vector} c Cohesion vector
   * @param  {p5.Vector} s Separtion vector
   * @param  {p5.Vector} a Alignment vector
   * @param  {p5.Vector} w Wander vector
   * @return {p5.Vector}   A weighted average of these vectors
   */
  process(c, s, a, w) {
    c.mult(this.stick);
    s.mult(this.avoid);
    a.mult(this.align);
    w.mult(this.wandr);
    var mix = p5.Vector.add(c, s);
    mix.add(a);
    mix.add(w);
    return mix;
  }

  sum() {
    return this.stick + this.avoid + this.align + this.wandr;
  }
}

/**
 * A class that will represent a transition condition for a species
 * @class
 */
class Transition {
  constructor(filter, species) {
    this.condition = filter;
    this.endstate = species;
  }
}



/**
 * A class representing a species (specific type of agent)
 * @class
 */
class Species {


  /**
   * constructor - Creates a default Species object
   *
   * @return {Species}  A Species object
   */
  constructor() {
    this.size = 2;
    this.range = 20;
    this.maxSpeed = 2;
    this.wanderDev = 1.5;
    this.color = mainSketch.color(Math.floor(360*Math.random()), 100, 50);
    this.fixed = false;
    this.id = ('0000' + Math.floor(Math.random()*10000)).slice(-4);
    this.name = 'Species #' + this.id;
    this.html = speciesHTML(this.name);
    this.inter = {};
    this.trans = {};
  }
}

/**
 * A class representing an agent having a type (Species)
 * and the ability to move in a 2D environment
 * @class
 */
class Agent {

  /**
   * constructor - description
   *
   * @param  {number} x       X position in space
   * @param  {number} y       Y position in space
   * @param  {Species} species The species of the agent
   * @return {Agent}         An Agent object
   */
  constructor(x, y, species) {
    this.pos = sim.createVector(x, y);
    this.vel = sim.createVector(
      mainSketch.mouseX - mainSketch.pmouseX,
      mainSketch.mouseY - mainSketch.pmouseY).setMag(species.maxSpeed);
    this.acc = sim.createVector();
    this.species = species;
    this.locale = {};
  }


  /**
   * show - Draws the agent on a canvas supplied
   *
   * @param  {p5} sketch A p5 canvas instance
   */
  show(sketch) {
    sketch.fill(this.species.color);
    sketch.ellipse(this.pos.x, this.pos.y, this.species.size, this.species.size);
  }


  /**
   * processLocale - Given a region of agents nearby, adjust this agent's
   * acceleration based on Species interactions (specified by Behavior objects)
   *
   */
  processLocale() {
    //Reset forces acting on agent
    this.acc.set(0, 0);
    //Get the species keys from the locale
    var keys = Object.keys(this.locale);
    //If none, do nothing
    if(keys.length == 0)
      return;
    //Count agents for normalization
    var count = 0;
    for(var type of keys) {
      //Determine proper interaction for agent
      var behavior = this.species.inter[type];
      if(behavior == undefined)
        continue;
      //Calculate base vectors
      var combo = wanderVector(this, this.species.wanderDev);
      if(this.locale[type].length != 0) {
        var cohes = cohesionVector(this, this.locale[type]);
        var separ = separationVector(this, this.locale[type]);
        var align = alignmentVector(this, this.locale[type]);
        combo = behavior.process(cohes, separ, align, combo);
      }
      //Weight by the number of agents of that species
      combo.mult(this.locale[type].length);
      //Add to total agent count for normalization
      count += this.locale[type].length;
      //Add to the acceleration
      this.acc.add(combo);
    }
    //Normalize by the total count
    if(count > 0)
      this.acc.mult(1.0/count);
  }


  /**
   * update - Function to update this agent's position, velocity, etc
   */
  update() {
    if(this.species.fixed)
      return;
    this.processLocale();
    this.vel.add(this.acc);
    this.vel.limit(this.species.maxSpeed); //Limiting speeds
    this.pos.add(this.vel);
  }
}

Species.prototype.toString = function() {
  return this.id;
}


/**
 * var cohesionVector - function providing a vector to center of mass
 *
 * @param  {Agent} focus The agent the vector is created for
 * @param  {list} agents List of agents in local area
 * @return {p5.Vector}      The cohesion vector
 */
var cohesionVector = function(focus, agents) {
  var vect = sim.createVector();
  for(let ag of agents) {
    vect.add(ag.pos);
  }
  vect.mult(1.0/agents.length); //Vect is the centroid
  vect.sub(focus.pos); //Vect points from focus to centroid
  //vect.normalize();
  return vect;
}

/**
 * var cohesionVector - function providing a vector away from the
 * agents in the local area
 *
 * @param  {Agent} focus The agent the vector is created for
 * @param  {list} agents List of agents in local area
 * @return {p5.Vector}      The seperation vector
 */
var separationVector = function(focus, agents) {
  var vect = sim.createVector();
  for(let ag of agents) {
    var sep = p5.Vector.sub(focus.pos, ag.pos);
    //sep.normalize();
    sep.mult(focus.species.range/sep.magSq());
    vect.add(sep);
  }
  return vect;
}

/**
 * var cohesionVector - function averaging velocity vectors of agents
 * in local area
 *
 * @param  {Agent} focus The agent the vector is created for
 * @param  {list} agents List of agents in local area
 * @return {p5.Vector}      The alignment vector
 */
var alignmentVector = function(focus, agents) {
  var vect = sim.createVector();
  for(let ag of agents) {
    var dir = ag.vel.copy();
    dir.normalize();
    vect.add(dir);
  }
  vect.normalize();
  return vect;
}


/**
 * var wanderVector - function to produce a random vector offset from the
 * agents current velocity
 *
 * @param  {Agent} agent The agent the vector is created for
 * @param  {number} range The distance over which the range can very: 0 - pi for best results
 * @return {p5.Vector}    The wander vector
 */
var wanderVector = function(agent, range) {
  var vect = p5.Vector.fromAngle(agent.vel.heading() + sim.random(-range, range));
  return vect;
}
