function setup()
{
  var canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
}

function draw()
{
  if(mouseIsPressed && canvas.mouseOver())
    ellipse(mouseX, mouseY, 80, 80);
}
