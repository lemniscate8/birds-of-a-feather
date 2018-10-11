
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
