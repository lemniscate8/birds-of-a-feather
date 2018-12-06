

/**
 * A group of global variables polluting the namespace but that would
 * be too hard to do without
 */
var engine;
var species = [];
var activeSpecies;
var interest = [];
var mainSketch;

var runMode;
var touchMode;

var penWidth = 10;
var spacing = 2;

/**
 * var simulationSketch - description
 *
 * @param  {p5} sketch A p5 sketch canvas on which to draw
 * @return {type}        description
 */
var simulationSketch = function(sketch) {
  mainSketch = sketch;


  /**
   * setup - A function run once before to create the canvas
   * @function
   */
  sketch.setup = function() {
    sketch.createCanvas(640, 480); //Setup the canvas in the element passed in
    engine = new Engine(sketch.width, sketch.height, 20);
    species.push(new Species());
    $(species[0].html).click();
    activeSpecies.inter[activeSpecies] = new Behavior();
    sketch.background(0);
    engine.show(sketch);
    sketch.colorMode(sketch.HSL);
    runMode = halt;
    touchMode = addAgents;
  }

  /**
   * draw - The draw loop for the sketch, does whatever the runMode is:
   * run or halt
   *
   * @function
   */
  sketch.draw = function() {
    runMode(sketch);
  }

  /**
   * dragging - A function to handle drag events
   * @function
   */
  sketch.mouseDragged = function() {
    if(sketch.mouseX > sketch.width || sketch.mouseX < 0)
      return;
    if(sketch.mouseY > sketch.height || sketch.mouseY < 0)
      return;
    if(sketch.mouseX == sketch.pmouseX && sketch.mouseY == sketch.pmouseY)
      return;
    touchMode(sketch);
  }
}


/**
 * Sets up the canvas in the HTML page in instance mode
 * (allows for multiple canvasses)
 */
var sim = new p5(simulationSketch, 'simHolder');


/**
 * resetEnvironment - Clears all agents in the engine
 * @function
 */
resetEnvironment = function() {
  engine.agents = [];
}


/**
 * resetAll - Clears all agents in the engine and deletes all species types
 * @function
 */
resetAll = function() {
  engine.agents = [];
  $('.speciesDelete').click();
}


/**
 * var run - A function that runs the simulation (updating agents, drawing
 * etc.)
 *
 * @param  {p5} sketch A sketch canvas on which to draw
 */
var run = function(sketch) {
  sketch.background(0);
  sketch.fill(255);
  sketch.noStroke();
  engine.update();
  engine.show(sketch);
  sketch.fill(255, 0, 0);
  for(let agent of interest) {
    agent.show(sketch);
  }
  drawCursor(sketch);
}


/**
 * var halt - A function that only draws agents, and does not update;
 * a holding pattern
 *
 * @param  {p5} sketch A sketch canvas on which to draw
 */
var halt = function(sketch) {
  sketch.background(0);
  sketch.fill(255);
  sketch.noStroke();
  engine.show(sketch);
  drawCursor(sketch);
}


/**
 * var drawCursor - Draws the curser to indicate pen size and drawing density
 *
 * @param  {p5} sketch A sketch canvas on which to draw
 */
var drawCursor = function(sketch) {
  sketch.noFill();
  sketch.stroke(255, 10);
  sketch.ellipse(sketch.mouseX, sketch.mouseY, 2*penWidth, 2*penWidth);
  sketch.ellipse(sketch.mouseX, sketch.mouseY, 2*spacing, 2*spacing);
}


/**
 * var addAgents - Adds agents the the engine in a circular region randomly
 *  based on the pen density and size
 *
 * @param  {p5} sketch A sketch canvas to get mouse coordinates
 */
var addAgents = function(sketch) {
  if(activeSpecies == null)
    return;
  var loc = p5.Vector.random2D().mult(penWidth*Math.sqrt(sketch.random(0,1)));
  loc.add(sketch.mouseX, sketch.mouseY);
  if(engine.inround(loc, spacing).length == 0) {
    engine.add(new Agent(loc.x, loc.y, activeSpecies));
  }
}


/**
 * var removeAgents - Removes agents in a circular region from the engine
 *
 * @param  {p5} sketch A sketch canvas to get mouse coordinates
 */
var removeAgents = function(sketch) {
  var loc = sim.createVector(sketch.mouseX, sketch.mouseY);
  var area = engine.inround(loc, penWidth);
  for(let agent of area) {
    engine.remove(agent);
  }
}
