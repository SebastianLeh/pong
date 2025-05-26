// Unified background manager for switching between simple and dynamic backgrounds

// Background types
const BACKGROUND_TYPES = {
  SIMPLE: 'simple',
  DYNAMIC: 'dynamic'
};

// Global manager state
let currentBackgroundType = BACKGROUND_TYPES.DYNAMIC;
let currentColorSchemeIndex = 0;

// Background manager class
class BackgroundManager {
  constructor() {
    this.backgroundType = BACKGROUND_TYPES.DYNAMIC;
    this.colorSchemeIndex = 0;
  }

  // Initialize both background systems
  init() {
    // Initialize both background types
    initBackground(); // Dynamic background
    initSimpleBackground(); // Simple background
  }

  // Draw the current background type
  draw() {
    if (this.backgroundType === BACKGROUND_TYPES.SIMPLE) {
      drawSimpleBackground();
    } else {
      drawBackground();
    }
  }

  // Switch between background animation types
  switchBackgroundType() {
    if (this.backgroundType === BACKGROUND_TYPES.SIMPLE) {
      this.backgroundType = BACKGROUND_TYPES.DYNAMIC;
      currentBackgroundType = BACKGROUND_TYPES.DYNAMIC;
    } else {
      this.backgroundType = BACKGROUND_TYPES.SIMPLE;
      currentBackgroundType = BACKGROUND_TYPES.SIMPLE;
    }
    
    // Re-initialize the current background with current color scheme
    this.applyCurrentColorScheme();
  }

  // Change color scheme for current background type
  changeColorScheme() {
    this.colorSchemeIndex = (this.colorSchemeIndex + 1) % ColorSchemes.length;
    currentColorSchemeIndex = this.colorSchemeIndex;
    this.applyCurrentColorScheme();
  }

  // Apply current color scheme to active background
  applyCurrentColorScheme() {
    const currentScheme = ColorSchemes[this.colorSchemeIndex];
    
    if (this.backgroundType === BACKGROUND_TYPES.SIMPLE) {
      // Update simple background palette
      if (typeof window !== 'undefined' && window.simpleBackgroundPalette) {
        window.simpleBackgroundPalette = {
          name: currentScheme.name,
          colors: currentScheme.colors
        };
      }
    } else {
      // Update dynamic background palette
      if (typeof window !== 'undefined' && window.backgroundPalette) {
        window.backgroundPalette = {
          name: currentScheme.name,
          colors: currentScheme.colors
        };
      }
    }
  }

  // Get current background type name for display
  getCurrentBackgroundTypeName() {
    return this.backgroundType === BACKGROUND_TYPES.SIMPLE ? 'Simple' : 'Dynamic';
  }

  // Get current color scheme name for display
  getCurrentColorSchemeName() {
    return ColorSchemes[this.colorSchemeIndex].name;
  }
}

// Export for ES6 modules
export { BackgroundManager, BACKGROUND_TYPES };

// Also make available globally
if (typeof window !== 'undefined') {
  window.BackgroundManager = BackgroundManager;
  window.BACKGROUND_TYPES = BACKGROUND_TYPES;
  window.currentBackgroundType = currentBackgroundType;
  window.currentColorSchemeIndex = currentColorSchemeIndex;
}
