//New canvases using p5 instance mode to allow for multiple sketches
var engine;
var species;
var interest = [];
var runMode;
var touchMode;
var penWidth = 10;

var simulationSketch = function(sketch)
{
  sketch.setup = function()
  {
    sketch.createCanvas(640, 480); //Setup the canvas in the element passed in
    engine = new Engine(sketch.width, sketch.height, 10);
    species = new Species(2, 10);
    species.inter[species] = new Behavior(5, 1, 1, 1);
    /*
    for(var i = 0; i < 1000; i++) {
      engine.add(new Agent(sketch.random(0, sketch.width), sketch.random(0, sketch.height),
      species));
    }
    */
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
  var loc = p5.Vector.random2D().mult(penWidth).add(sketch.mouseX, sketch.mouseY);
  if(engine.inround(loc, species.range).length == 0) {
    engine.add(new Agent(loc.x, loc.y, species));
  }
}
