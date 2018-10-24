//New canvases using p5 instance mode to allow for multiple sketches
var engine;
var species;
var interest = [];

var simulationSketch = function(sketch)
{

  sketch.setup = function()
  {
    sketch.createCanvas(640, 480); //Setup the canvas in the element passed in
    engine = new Engine(sketch.width, sketch.height, 10);
    species = new Species();
    species.inter[species] = new Behavior(1, 1, 1, 1);
    for(var i = 0; i < 1000; i++) {
      engine.add(new Agent(sketch.random(0, sketch.width), sketch.random(0, sketch.height),
      species));
    }
    sketch.background(0);
    engine.show(sketch);
  }

  sketch.mousePressed = function() {
    if(sketch.mouseX > sketch.width || sketch.mouseX < 0)
      return;
    if(sketch.mouseY > sketch.height || sketch.mouseY < 0)
      return;
    interest = engine.inround(sim.createVector(sketch.mouseX, sketch.mouseY), 50);
  }

  sketch.draw = function()
  {
    sketch.background(0);
    sketch.fill(255);
    engine.show(sketch);
    engine.update();
    sketch.fill(255, 0, 0);
    for(let agent of interest) {
      agent.show(sketch);
    }

  }
}
//Put the sketch in the element with the ID here
var sim = new p5(simulationSketch, 'sketchHolder');
