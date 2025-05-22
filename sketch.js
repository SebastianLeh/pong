// Game variables
let leftPaddle;
let rightPaddle;
let ball;
let leftScore = 0;
let rightScore = 0;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_SPEED = 6;
const WINNING_SCORE = 7;

function setup() {
  createCanvas(800, 500);
  
  // Initialize background visualization
  initBackground();
  
  // Create paddles
  leftPaddle = {
    x: 30,
    y: height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0,
    move: function(dir) {
      this.y += dir * PADDLE_SPEED;
      // Keep paddle on screen
      this.y = constrain(this.y, 0, height - this.height);
    }
  };
  
  rightPaddle = {
    x: width - 30 - PADDLE_WIDTH,
    y: height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0,
    move: function(dir) {
      this.y += dir * PADDLE_SPEED;
      // Keep paddle on screen
      this.y = constrain(this.y, 0, height - this.height);
    }
  };
  
  // Create ball
  resetBall();
}

function resetBall() {
  ball = {
    x: width/2,
    y: height/2,
    size: BALL_SIZE,
    speedX: random([-4, -3, 3, 4]),
    speedY: random(-3, 3),
    update: function() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Bounce off top and bottom edges
      if (this.y < 0 || this.y > height - this.size) {
        this.speedY *= -1;
      }
      
      // Check for score (ball passes left or right edge)
      if (this.x < 0) {
        rightScore++;
        resetBall();
      } else if (this.x > width) {
        leftScore++;
        resetBall();
      }
      
      // Collision with paddles
      if (this.x <= leftPaddle.x + leftPaddle.width && 
          this.y + this.size >= leftPaddle.y && 
          this.y <= leftPaddle.y + leftPaddle.height &&
          this.x >= leftPaddle.x) {
        this.speedX *= -1.1; // Increase speed slightly
        this.x = leftPaddle.x + leftPaddle.width;
        // Add some variation to y speed based on where the ball hits the paddle
        this.speedY = map(this.y - leftPaddle.y, 0, leftPaddle.height, -4, 4);
      }
      
      if (this.x + this.size >= rightPaddle.x && 
          this.y + this.size >= rightPaddle.y && 
          this.y <= rightPaddle.y + rightPaddle.height &&
          this.x + this.size <= rightPaddle.x + rightPaddle.width) {
        this.speedX *= -1.1; // Increase speed slightly
        this.x = rightPaddle.x - this.size;
        // Add some variation to y speed based on where the ball hits the paddle
        this.speedY = map(this.y - rightPaddle.y, 0, rightPaddle.height, -4, 4);
      }
    }
  };
}

function draw() {
  // Draw animated background
  background(255);
  drawBackground();
  
  // Handle player input
  // Left paddle (W/S keys)
  if (keyIsDown(87)) { // W key
    leftPaddle.move(-1);
  }
  if (keyIsDown(83)) { // S key
    leftPaddle.move(1);
  }
  
  // Right paddle (UP/DOWN arrow keys)
  if (keyIsDown(UP_ARROW)) {
    rightPaddle.move(-1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    rightPaddle.move(1);
  }
  
  // Update ball
  ball.update();
  
  // Draw dividing line
  stroke(200);
  strokeWeight(2);
  line(width/2, 0, width/2, height);
  
  // Draw score
  noStroke();
  fill(0);
  textSize(32);
  textAlign(CENTER);
  text(leftScore, width/4, 50);
  text(rightScore, 3*width/4, 50);
  
  // Draw paddles
  fill(0);
  noStroke();
  rect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  rect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  
  // Draw ball
  fill(0);
  noStroke();
  rect(ball.x, ball.y, ball.size, ball.size);
  
  // Check for winner
  if (leftScore >= WINNING_SCORE || rightScore >= WINNING_SCORE) {
    gameOver();
  }
}

function gameOver() {
  // Stop the game
  noLoop();
  
  // Show game over message
  background(255);
  drawBackground();
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  if (leftScore > rightScore) {
    text("Left player wins!", width/2, height/2);
  } else {
    text("Right player wins!", width/2, height/2);
  }
  
  // Instructions to restart
  textSize(16);
  text("Press SPACE to play again", width/2, height/2 + 50);
  text("Press B to change background", width/2, height/2 + 70);
}

function keyPressed() {
  // Restart game if space is pressed after game over
  if (key === ' ' && (leftScore >= WINNING_SCORE || rightScore >= WINNING_SCORE)) {
    leftScore = 0;
    rightScore = 0;
    resetBall();
    loop();
  }
  
  // Change background with 'B' key
  if (key === 'b' || key === 'B') {
    changeBackgroundStyle();
  }
}
