// Background visualization for Pong
// Simplified version that doesn't depend on dj_spin

// Global variables for background
let backgroundPalette;
let backgroundMotif;
let backgroundAlpha = 0.3; // Low opacity for background

// Color schemes - simplified subset
const ColorSchemes = [
  { name: "Klein", colors: ["#344CB9", "#1B288A", "#0F185B", "#D7C99A", "#F2E4C7"] },
  { name: "Haru", colors: ["#F2DADF", "#E9D6F9", "#EACEE9", "#f2dadf", "#ffefe7"] },
  { name: "SpringPastels", colors: ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65"] },
  { name: "MidnightDream", colors: ["#030213", "#13115a", "#8587a8", "#30ff9c", "#1b1c34"] },
  { name: "BlueNightclub", colors: ["#4500fe", "#581afe", "#6a33fe", "#7d4dfe", "#8f66fe"] }
];

function initBackground() {
  // Get a random color scheme for background
  const randomScheme = ColorSchemes[Math.floor(Math.random() * ColorSchemes.length)];
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

  // Get drawing context safely
  if (typeof drawingContext === 'undefined') {
    console.warn('drawingContext not available, skipping gradient');
    return;
  }

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
    this.w = this.size;
    this.h = this.size;
    
    // Dynamic movement properties
    this.localAngle = 0;
    this.pulseFactor = 1.0;
    this.driftX = 0;
    this.driftY = 0;
    this.rotationSpeed = random(-0.02, 0.02);
    this.pulseSpeed = random(0.01, 0.03);
    this.driftSpeed = random(0.005, 0.015);
    this.maxDrift = random(20, 50);
  }

  run() {
    push();
    
    // Update dynamic properties
    this.localAngle += this.rotationSpeed;
    this.pulseFactor = 1.0 + sin(frameCount * this.pulseSpeed) * 0.3;
    this.driftX = sin(frameCount * this.driftSpeed) * this.maxDrift;
    this.driftY = cos(frameCount * this.driftSpeed * 0.7) * this.maxDrift * 0.5;
    
    translate(this.originX + this.driftX, this.originY + this.driftY);
    scale(this.scaleX * this.pulseFactor, this.scaleY * this.pulseFactor);
    rotate(this.angle + this.localAngle);

    let colorsForGradient = ['#0000FF', '#00FFFF']; // Fallback
    if (backgroundPalette && backgroundPalette.colors && backgroundPalette.colors.length > 0) {
      colorsForGradient = backgroundPalette.colors;
    }

    // Dynamic size for gradient
    const dynamicH = this.h * this.pulseFactor;
    
    setBackgroundGradient({
      type: 'repeating-linear',
      colors: colorsForGradient,
      repetitions: 15, // Reduced for performance
      x0: 0, y0: 0,
      x1: 0, y1: dynamicH * 2,
    });
    
    // Draw the shape
    ellipse(0, 0, this.w, dynamicH);
    
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
    
    // Dynamic motif properties
    this.breathing = 1.0;
    this.breathingSpeed = 0.008;
    this.swayX = 0;
    this.swayY = 0;
    this.swaySpeed = 0.006;
    
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
    
    // Update dynamic motif properties
    this.breathing = 1.0 + sin(frameCount * this.breathingSpeed) * 0.2;
    this.swayX = sin(frameCount * this.swaySpeed) * 30;
    this.swayY = cos(frameCount * this.swaySpeed * 0.8) * 20;
    
    translate(this.originX + this.swayX, this.originY + this.swayY);
    scale(this.breathing);
    
    const angleStep = PI / this.repeat;
    this.angle += angleStep * 0.05; // Slower rotation for background
    rotate(this.angle);
    
    for (let i = 0; i < this.repeat; i++) {
      const element = this.elements[i];
      const t = angleStep * i + frameCount * 0.005; // Slower animation
      
      // More dynamic rotation per element
      const dynamicRotation = t * 0.03 + sin(frameCount * 0.01 + i) * 0.1;
      rotate(dynamicRotation);
      
      // More complex size variations
      const sizeVariation = map(sin(t + frameCount * 0.003), -1, 1, 0.6, 1.4);
      const aspectRatio = map(cos(t * 1.3 + frameCount * 0.004), -1, 1, 0.8, 1.2);
      
      element.w = element.size * sizeVariation;
      element.h = element.size * sizeVariation * aspectRatio;
      
      element.run();
    }
    pop();
  }
}

// Function to change background style
function changeBackgroundStyle() {
  const randomScheme = ColorSchemes[Math.floor(Math.random() * ColorSchemes.length)];
  backgroundPalette = {
    name: randomScheme.name,
    colors: randomScheme.colors
  };
}

// Export for ES6 modules
export { initBackground, drawBackground, changeBackgroundStyle, ColorSchemes };

// Also make available globally for classes to access
if (typeof window !== 'undefined') {
  window.initBackground = initBackground;
  window.drawBackground = drawBackground;
  window.changeBackgroundStyle = changeBackgroundStyle;
  window.ColorSchemes = ColorSchemes;
  window.setBackgroundGradient = setBackgroundGradient;
  window.BackgroundElement = BackgroundElement;
  window.BackgroundMotif = BackgroundMotif;
  
  // Make variables accessible globally so classes can modify them
  Object.defineProperty(window, 'backgroundPalette', {
    get: () => backgroundPalette,
    set: (value) => { backgroundPalette = value; }
  });
  Object.defineProperty(window, 'backgroundMotif', {
    get: () => backgroundMotif,
    set: (value) => { backgroundMotif = value; }
  });
  Object.defineProperty(window, 'backgroundAlpha', {
    get: () => backgroundAlpha,
    set: (value) => { backgroundAlpha = value; }
  });
}
