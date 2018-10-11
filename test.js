

function setup()
{
  var canvas = createCanvas(640, 480);
  canvas.parent('sketch-holder');
}

function draw()
{
  if(mouseIsPressed)
    ellipse(mouseX, mouseY, 80, 80);
}

canvasVisible = false;
function toggleView()
{
  if(canvasVisible) {
    canvas.hide();
  }
  else {
    canvas.show();
  }

}
