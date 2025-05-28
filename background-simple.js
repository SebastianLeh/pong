// Simple background system - original lightweight version
// Static moving circles without complex animations

// Global variables for simple background
let simpleBackgroundPalette;
let simpleBackgroundMotif;
let simpleBackgroundAlpha = 0.3;

// Initialize simple background
function initSimpleBackground() {
  const randomScheme = ColorSchemes[Math.floor(Math.random() * ColorSchemes.length)];
  simpleBackgroundPalette = {
    name: randomScheme.name,
    colors: randomScheme.colors
  };
  
  simpleBackgroundMotif = new SimpleBackgroundMotif({
    originX: width / 2,
    originY: height / 2,
  });
}

// Draw simple background
function drawSimpleBackground() {
  push();
  tint(255, simpleBackgroundAlpha * 255);
  
  if (simpleBackgroundMotif) {
    simpleBackgroundMotif.run();
  }
  pop();
}

// Simple background element class (original version)
class SimpleBackgroundElement {
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
    if (simpleBackgroundPalette && simpleBackgroundPalette.colors && simpleBackgroundPalette.colors.length > 0) {
      colorsForGradient = simpleBackgroundPalette.colors;
    }

    setBackgroundGradient({
      type: 'repeating-linear',
      colors: colorsForGradient,
      repetitions: 15, // Reduced for performance
      x0: 0, y0: 0,
      x1: 0, y1: this.h * 2,
    });
    
    // Add subtle shadow
    const ctx = window.drawingContext || (typeof drawingContext !== 'undefined' ? drawingContext : null);
    if (ctx) {
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }
    
    ellipse(0, 0, this.w, this.h);
    
    // Reset shadow
    if (ctx) {
      ctx.shadowColor = 'rgba(0,0,0,0)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    
    pop();
  }
}

// Simple background motif class (original version)
class SimpleBackgroundMotif {
  constructor(props) {
    this.id = props.id || 0;
    this.originX = props.originX || 0;
    this.originY = props.originY || 0;
    this.angle = props.angle || 0;
    this.repeat = 12; // Reduced for performance
    this.size = 400; // Smaller for background
    this.elements = [];
    
    for (let i = 0; i < this.repeat; i++) {
      const element = new SimpleBackgroundElement({
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

// Export for ES6 modules
export { initSimpleBackground, drawSimpleBackground, SimpleBackgroundElement, SimpleBackgroundMotif };

// Also make available globally
if (typeof window !== 'undefined') {
  window.initSimpleBackground = initSimpleBackground;
  window.drawSimpleBackground = drawSimpleBackground;
  window.SimpleBackgroundElement = SimpleBackgroundElement;
  window.SimpleBackgroundMotif = SimpleBackgroundMotif;
  
  // Make variables accessible globally
  Object.defineProperty(window, 'simpleBackgroundPalette', {
    get: () => simpleBackgroundPalette,
    set: (value) => { simpleBackgroundPalette = value; }
  });
  Object.defineProperty(window, 'simpleBackgroundMotif', {
    get: () => simpleBackgroundMotif,
    set: (value) => { simpleBackgroundMotif = value; }
  });
  Object.defineProperty(window, 'simpleBackgroundAlpha', {
    get: () => simpleBackgroundAlpha,
    set: (value) => { simpleBackgroundAlpha = value; }
  });
}
