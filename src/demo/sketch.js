var font;
var mainMenu = true;
var circlefall = false;
var gridshot = false;
var endgame = false;
var gamePaused = false;

var gridshotOccupied = [[false, false, false, false, false],[false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false], [false, false, false, false, false]];
var gridshotCoords_x = [200, 300, 400, 500, 600];
var gridshotCoords_y = [100, 200, 300, 400, 500];

//declare objects in setup else errors occur
var gridshotButton;
var circlefallButton;
var mainmenuButton;
var resetgameButton;
var circles = [];

var frames = 0;
var timer = 0;
var countdown = 3;

var totalClicks = 0;
var totalHit = 0;
var totalMissed = 0;
var totalMisclicks = 0;

var lastGame;





function setup() {
  var canvas = createCanvas(800, 600);
  canvas.parent('sketch');
  frameRate(48);
  ellipseMode(CENTER);
  rectMode(CENTER);
  noStroke();
  font = 'Inconsolata'
  textFont(font);
  circlefallButton = new Button(400, 245, 270, 100, 7, "Circlefall", color(0, 174, 255));
  gridshotButton = new Button(400, 400, 270, 100, 7, "Gridshot", color(255, 33, 33));
  mainmenuButton = new Button(553, 420, 200, 80, 7, "Main Menu", color(0));
  resetgameButton = new Button(247, 420, 200, 80, 7, "Restart", color(0));
}

function draw() {
  background(209, 218, 227);
  //for some reason variables and functions can't have the same name
  drawMainMenu();
  playCirclefall();
  playGridshot();
  drawEndGame();
  textAlign(LEFT);
  textSize(10);
  text(int(frameRate()), 780, 20);
}

function mousePressed() {
  if(mainMenu){
    if(circlefallButton.isHoveringButton()){
      mainMenu = false;
      circlefall = true;
    }
    else if(gridshotButton.isHoveringButton()){
      mainMenu = false;
      gridshot = true;
      for(let i = 0; i < 5; i++){
        circles.push(new Circle("gridshot"));
      }
    }
  }
  else if(endgame){
	if(mainmenuButton.isHoveringButton()){
		resetGame();
		endgame = false;
		mainMenu = true;
	}
	else if(resetgameButton.isHoveringButton()){
		endgame = false;
		resetLastGame(lastgame);
	}
  }
  else if(circlefall && !gamePaused){
    totalClicks++;
    for(let i = circles.length - 1; i >= 0; i--){
      if(circles[i].isHoveringCircle()){
        circles[i].circlefallHit();
        totalHit++;
        break;
      }
    }
  }
  else if(gridshot && !gamePaused && countdown == 0){
    totalClicks++;
    for(let i = 0; i < circles.length; i++){
      if(circles[i].isHoveringCircle()){
        circles[i].gridshotHit();
        totalHit++;
      }
    }
  }
}

function keyPressed(){
  if(mainMenu == false){
    if(key == ESCAPE){
      gamePaused = !gamePaused;
    }
    if(key == 'R' || key == 'r'){
      resetLastGame(lastGame);
    }
  }
}

function drawMainMenu() {
  if(mainMenu){
    textAlign(CENTER);
    textSize(60);
    fill(0);
    text("circlegame", 400, 115);
    circlefallButton.drawButton();
    gridshotButton.drawButton();
    textAlign(LEFT);
    textSize(15);
    fill(0);
    text("WEB DEMO\n(download for access to the full game)", 5, 580);
  }
}

function playCirclefall() {
  if(endgame == false && mainMenu == false){
    if(circlefall){
      lastGame = "circlefall";
      for(let i = 0; i < circles.length; i++){
        circles[i].drawCircle();
        circles[i].updateCircle();
      }
      fill(0);
      textSize(25);
      textAlign(LEFT);
      text("Hits: " + totalHit, 10, 25);
      text("Misses: " + totalMissed, 10, 60);
      if(frameCount%16 == 0 && circles.length < 100){
        circles.push(new Circle("circlefall"))
      }
      if(totalHit + totalMissed >= 1){
        circlefall = false;
        endgame = true;
      }
    }
  }
}

function playGridshot() {
  if(gridshot){
    lastGame = "gridshot";
    for(let i = 0; i < circles.length; i++){
      circles[i].drawCircle();
    }
    gameTimer();
    drawPauseMenu();
  }
}

function gameTimer(){
  if(gamePaused == false){
    frames++;
  }
  if(frames % 48 == 0){
    if(countdown > 0){
      countdown--;
    }
    else{
      timer++;
    }
  }
  if(countdown > 0){
    textAlign(CENTER);
    fill(0);
    textSize(80);
    text(countdown, 400, 300);
  }

  
}

function drawPauseMenu(){
  
}

function resetGame(){
  timer = 0;
  countdown = 3;
  frames = 0;
  totalClicks = 0;
  totalHit = 0;
  totalMissed = 0;
  totalMisclicks = 0;
  circles = [];
}

function resetLastGame(game){
  resetGame();
  if(game == "circlefall"){
    circlefall = true;
  }
  else if(game == "gridshot"){
    gridshot = true;
    for(let i = 0; i < 5; i++){
      circles.push(new Circle("gridshot"));
    }    
  }
}

function drawEndGame(){
	if(endgame && lastGame == "circlefall"){
		textAlign(CENTER);
		textSize(40);
		fill(176,196,222);
		stroke(0);
		rect(400, 300, 700, 500, 50);
		noStroke();
		fill(0);
		text("Game Over", 400, 100);
		mainmenuButton.drawButton();
		resetgameButton.drawButton();
	}
}




class Circle{
  constructor(game){
    if(game == "circlefall"){
      this.x = int(random()*700 + 50);
      this.y = 0;
      this.speed_y = random()*1.25 + 3.75;
      this.size = 65;
      this.R = 0;
      this.G = 174;
      this.B = 255;
      this.row = -1;
      this.col = -1;
    }
    else if(game == "gridshot"){
      this.row = int(random() * 5);
      this.col = int(random() * 5);
      while(gridshotOccupied[this.row][this.col] == true){
        this.row = int(random() * 5);
        this.col = int(random() * 5);
      }
      this.x = gridshotCoords_x[this.row];
      this.y = gridshotCoords_y[this.col];
      gridshotOccupied[this.row][this.col] = true;
      this.size = 90;
      this.R = 255;
      this.G = 33;
      this.B = 33;
    }
  }
  
  updateCircle(){
    this.y += this.speed_y;
    if(this.y > 665){
      this.y = -100;
      this.x = -100;
      this.speed_y = 0;
      totalMissed++;
    }
  }
  
  drawCircle(){
    fill(this.R, this.G, this.B);
    stroke(0);
    ellipse(this.x, this.y, this.size, this.size);
    noStroke(0);
  }
  
  isHoveringCircle(){
    if(sqrt(pow(this.x - mouseX,2) + pow(this.y - mouseY,2)) < (this.size / 2) + 1){
      return true;
    }
    return false;
  }
  
  circlefallHit(){
    this.x = -100;
    this.y = -100;
    this.speed_y = 0;
  }
  
  gridshotHit(){
    let oldRow = this.row;
    let oldCol = this.col;
    while(gridshotOccupied[this.row][this.col] == true){
      this.row = int(random() * 5);
      this.col = int(random() * 5);
    }
    this.x = gridshotCoords_x[this.row];
    this.y = gridshotCoords_y[this.col];
    gridshotOccupied[oldRow][oldCol] = false;
    gridshotOccupied[this.row][this.col] = true;
  }
}

class Button{
  constructor(x, y, width, height, curve, text, textColor){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.curve = curve;
    this.text = text;
    this.textColor = textColor;
  }

  drawButton(){
    if(this.isHoveringButton()){
      fill(200);
    }else{
      fill(255);
    }
    stroke(230);
    rect(this.x, this.y, this.width, this.height, this.curve);
    noStroke();
    textSize(20);
    textAlign(CENTER)
    fill(this.textColor);
    text(this.text, this.x, this.y+5);
  }

  isHoveringButton(){
    if(mouseX >= (this.x - (this.width/2)) && mouseX <= (this.x + (this.width/2)) && mouseY >= (this.y - (this.height/2)) && mouseY <= (this.y + (this.height/2))){
      return true;
    }
    return false;
  }
  
  
  
}