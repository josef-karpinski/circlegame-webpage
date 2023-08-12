var canvas;
var backgroundCircles = [];


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0, "fixed");
  canvas.style('z-index', '-1');
  ellipseMode(CENTER);
}

function draw() {
  background(176,196,222);
  //176,196,222
  if(frameCount % 12 == 0){
    backgroundCircles.push(new Circle());
  }
  for(let i = 0; i < backgroundCircles.length; i++){
    backgroundCircles[i].drawCircle();
    if(backgroundCircles[i].y > windowHeight + 50){
      backgroundCircles.splice(i, 1);
      i--;
    }
  }
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}




class Circle{
  constructor(){
    this.x = int(random()*windowWidth);
    this.y = 0;
    this.size = 65;
    this.speed_y = random()*1.5 + 3;
  }
  
  drawCircle(){
    this.updateCircle();
    fill(0, 174, 255);
    stroke(0);
    ellipse(this.x, this.y, this.size, this.size);
    
  }
  
  updateCircle(){
    this.y += this.speed_y;
  }
  
}
    