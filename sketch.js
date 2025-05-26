// Import our modules
import { GamepadManager } from './gamepad.js';
import { initBackground, drawBackground, changeBackgroundStyle, ColorSchemes } from './backgrounds.js';
import { initSimpleBackground, drawSimpleBackground } from './background-simple.js';
import { BackgroundManager } from './background-manager.js';

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

// Module instances
let gamepadManager;
let backgroundManager;

// Make p5.js functions available globally for modules
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

function setup() {
  createCanvas(1200, 800);
  
  // Initialize our modules
  gamepadManager = new GamepadManager();
  backgroundManager = new BackgroundManager();
  
  // Initialize the backgrounds
  backgroundManager.init();
  
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
  // Draw background
  background(255);
  backgroundManager.draw();
  
  // Update gamepad state
  gamepadManager.update();
  
  // Handle gamepad input for paddles
  if (gamepadManager.hasGamepad) {
    // Left paddle - left stick, D-pad, or left shoulder/trigger
    const leftMovement = gamepadManager.getMovementInput();
    const leftTrigger = gamepadManager.getLeftTriggerMovement();
    
    if (leftMovement.y !== 0) {
      leftPaddle.move(leftMovement.y);
    } else if (gamepadManager.isButtonPressed('LB')) {
      leftPaddle.move(-1);
    } else if (leftTrigger > 0) {
      leftPaddle.move(leftTrigger);
    }
    
    // Right paddle - right stick, face buttons, or right shoulder/trigger
    const rightStick = gamepadManager.getRightStick();
    const rightTrigger = gamepadManager.getRightTriggerMovement();
    
    if (rightStick.y !== 0) {
      rightPaddle.move(rightStick.y);
    } else if (gamepadManager.isButtonPressed('Y') || gamepadManager.isButtonPressed('RB')) {
      rightPaddle.move(-1);
    } else if (gamepadManager.isButtonPressed('A') || rightTrigger > 0) {
      rightPaddle.move(rightTrigger > 0 ? rightTrigger : 1);
    }
    
    // Check for restart with gamepad
    if (gamepadManager.isButtonJustPressed('START') || gamepadManager.isButtonJustPressed('SELECT')) {
      checkGameRestart();
    }
  }
  
  // Keyboard controls (fallback)
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
  checkGameRestart();
  
  // Change background color scheme with 'C' key
  if (key === 'c' || key === 'C') {
    backgroundManager.changeColorScheme();
  }
  
  // Change background animation type with 'B' key
  if (key === 'b' || key === 'B') {
    backgroundManager.switchBackgroundType();
  }
}

// Separate function to check for game restart to handle both keyboard and gamepad
function checkGameRestart() {
  if (leftScore >= WINNING_SCORE || rightScore >= WINNING_SCORE) {
    // Check keyboard space key
    if (key === ' ') {
      leftScore = 0;
      rightScore = 0;
      resetBall();
      loop();
    }
  }
}
