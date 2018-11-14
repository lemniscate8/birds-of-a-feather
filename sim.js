//New canvases using p5 instance mode to allow for multiple sketches
var engine;
var species = [];
var activeSpecies;
var interest = [];
var mainSketch;

var runMode;
var touchMode;

var penWidth = 10;
var spacing = 2;

var simulationSketch = function(sketch)
{
  mainSketch = sketch;
  sketch.setup = function()
  {
    sketch.createCanvas(640, 480); //Setup the canvas in the element passed in
    engine = new Engine(sketch.width, sketch.height, 20);
    species.push(new Species());
    $(species[0].html).click();
    activeSpecies.inter[activeSpecies] = new Behavior(5, 1, 1, 0);

    sketch.background(0);
    engine.show(sketch);
    runMode = halt;
    touchMode = addAgents;
  }

  sketch.mouseDragged = function() {
    if(sketch.mouseX > sketch.width || sketch.mouseX < 0)
      return;
    if(sketch.mouseY > sketch.height || sketch.mouseY < 0)
      return;
    touchMode(sketch);
  }

  sketch.draw = function() {
    runMode(sketch);
  }
}
//Put the sketch in the element with the ID here
var sim = new p5(simulationSketch, 'simHolder');


//Mode functions for the draw loop
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
}

var halt = function(sketch) {
  sketch.background(0);
  sketch.fill(255);
  sketch.noStroke();
  engine.show(sketch);
}

var addAgents = function(sketch) {
  if(activeSpecies == null)
    return;
  var loc = p5.Vector.random2D().mult(penWidth).add(sketch.mouseX, sketch.mouseY);
  if(engine.inround(loc, spacing).length == 0) {
    engine.add(new Agent(loc.x, loc.y, activeSpecies));
  }
}

var removeAgents = function(sketch) {
  var loc = sim.createVector(sketch.mouseX, sketch.mouseY);
  var area = engine.inround(loc, penWidth);
  for(let agent of area) {
    engine.remove(agent);
  }
}
