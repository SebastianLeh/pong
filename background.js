// Background visualization based on DJ Spin
// Simplified version for use as Pong background

// Global variables for background
let backgroundPalette;
let backgroundMotif;
let backgroundAlpha = 0.3; // Low opacity for background

// Color schemes - simplified subset
const backgroundColorSchemes = [
  { name: "Klein", colors: ["#344CB9", "#1B288A", "#0F185B", "#D7C99A", "#F2E4C7"] },
  { name: "Haru", colors: ["#F2DADF", "#E9D6F9", "#EACEE9", "#f2dadf", "#ffefe7"] },
  { name: "SpringPastels", colors: ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65"] },
  { name: "MidnightDream", colors: ["#030213", "#13115a", "#8587a8", "#30ff9c", "#1b1c34"] },
  { name: "BlueNightclub", colors: ["#4500fe", "#581afe", "#6a33fe", "#7d4dfe", "#8f66fe"] }
];

function initBackground() {
  // Get a random color scheme for background
  const randomScheme = backgroundColorSchemes[Math.floor(Math.random() * backgroundColorSchemes.length)];
  backgroundPalette = {
    name: randomScheme.name,
    colors: randomScheme.colors
  };
  
  backgroundMotif = new BackgroundMotif({
    originX: width / 2,
    originY: height / 2,
  });
}

function drawBackground() {
  push();
  // Set low opacity for background effect
  tint(255, backgroundAlpha * 255);
  
  if (backgroundMotif) {
    backgroundMotif.run();
  }
  pop();
}

// Simplified gradient function for background
function setBackgroundGradient(options = {}) {
  let {
    type = 'linear',
    colors = ['#000000', '#ffffff'],
    x0 = 0, y0 = 0, x1 = null, y1 = null,
    r0 = 0, r1 = null,
    repetitions = 1
  } = options;

  let gradientColor;
  const ctx = drawingContext;

  switch (type) {
    case 'linear':
      if (x1 === null || y1 === null) return;
      gradientColor = ctx.createLinearGradient(x0, y0, x1, y1);
      break;
    case 'repeating-linear':
      if (x1 === null || y1 === null) return;
      gradientColor = ctx.createLinearGradient(x0, y0, x1, y1);
      if (repetitions > 1) colors = Array(repetitions).fill(colors).flat();
      break;
    case 'radial':
      if (r1 === null) return;
      gradientColor = ctx.createRadialGradient(x0, y0, r0, x0, y0, r1);
      break;
    default:
      return;
  }

  // Add color stops
  for (let i = 0; i < colors.length; i++) {
    const stop = i / (colors.length - 1);
    gradientColor.addColorStop(stop, colors[i]);
  }

  ctx.fillStyle = gradientColor;
  return gradientColor;
}

// Background element class
class BackgroundElement {
  constructor(props) {
    this.id = props.id || 0;
    this.originX = props.originX || 0;
    this.originY = props.originY || 0;
    this.scaleX = props.scaleX || 1.0;
    this.scaleY = props.scaleY || 1.0;
    this.angle = props.angle || 0;
    this.size = props.size || 100;
  }

  run() {
    push();
    translate(this.originX, this.originY);
    scale(this.scaleX, this.scaleY);
    rotate(this.angle);

    let colorsForGradient = ['#0000FF', '#00FFFF']; // Fallback
    if (backgroundPalette && backgroundPalette.colors && backgroundPalette.colors.length > 0) {
      colorsForGradient = backgroundPalette.colors;
    }

    setBackgroundGradient({
      type: 'repeating-linear',
      colors: colorsForGradient,
      repetitions: 15, // Reduced for performance
      x0: 0, y0: 0,
      x1: 0, y1: this.h * 2,
    });
    
    // Add subtle shadow
    drawingContext.shadowColor = 'rgba(0,0,0,0.1)';
    drawingContext.shadowBlur = 5;
    drawingContext.shadowOffsetX = 2;
    drawingContext.shadowOffsetY = 2;
    
    ellipse(0, 0, this.w, this.h);
    
    // Reset shadow
    drawingContext.shadowColor = 'rgba(0,0,0,0)';
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    
    pop();
  }
}

// Background motif class
class BackgroundMotif {
  constructor(props) {
    this.id = props.id || 0;
    this.originX = props.originX || 0;
    this.originY = props.originY || 0;
    this.angle = props.angle || 0;
    this.repeat = 12; // Reduced for performance
    this.size = 400; // Smaller for background
    this.elements = [];
    
    for (let i = 0; i < this.repeat; i++) {
      const element = new BackgroundElement({
        id: i,
        size: this.size - i * (this.size / this.repeat),
      });
      this.elements.push(element);
    }
  }

  run() {
    push();
    translate(this.originX, this.originY);
    const angleStep = PI / this.repeat;
    this.angle += angleStep * 0.05; // Slower rotation for background
    rotate(this.angle);
    
    for (let i = 0; i < this.repeat; i++) {
      const element = this.elements[i];
      const t = angleStep * i + frameCount * 0.005; // Slower animation
      rotate(t * 0.03); // Slower cumulative rotation
      element.w = map(sin(t), -1, 1, element.size * 0.6, element.size * 1.2);
      element.h = element.w;
      element.run();
    }
    pop();
  }
}

// Function to change background style
function changeBackgroundStyle() {
  const randomScheme = backgroundColorSchemes[Math.floor(Math.random() * backgroundColorSchemes.length)];
  backgroundPalette = {
    name: randomScheme.name,
    colors: randomScheme.colors
  };
}
