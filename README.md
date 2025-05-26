# Pong Game with p5.js

A classic Pong game implementation using p5.js with gamepad support and customizable animated backgrounds.

## Features

- Classic two-player Pong gameplay on a 1200x700 canvas
- USB gamepad controller support with automatic detection
- Keyboard controls as fallback
- Dual background system (Simple static vs Dynamic animated)
- Multiple color schemes for both background types
- Score tracking (first to 7 wins)
- Progressive ball speed increase
- Responsive canvas sizing for different screen sizes

## Files Overview

### Core Files

- **`index.html`** - The main HTML file that loads the game in a web browser
  - Links to p5.js library and game files as ES6 modules
  - Sets up the basic HTML structure
  - Entry point for running the game

- **`sketch.js`** - The main game logic and p5.js code
  - Contains all game mechanics (paddles, ball, collision detection)
  - Imports and uses gamepad and background modules
  - Manages game state and scoring
  - Controls the main game loop

### Modular System Files

- **`gamepad.js`** - Modular gamepad input handling
  - ES6 module for USB controller support
  - Automatic gamepad detection and mapping
  - Deadzone handling and button state management
  - Debug utilities for controller testing

- **`background-manager.js`** - Unified background system manager
  - Switches between simple and dynamic background types
  - Manages color scheme changes
  - Provides clean interface for background controls

- **`backgrounds.js`** - Dynamic animated background system
  - Complex animated effects with breathing, pulsing, and drifting elements
  - Multiple dynamic visual motifs with independent movement
  - Enhanced shadow and gradient effects
  - High visual complexity for immersive gameplay

- **`background-simple.js`** - Simple static background system
  - Lightweight static background with basic color schemes
  - Minimal visual effects for better performance
  - Clean, distraction-free gameplay experience

- **`style.css`** - Basic styling for the web page
  - Centers the game canvas
  - Sets page background and layout

### Configuration Files

- **`jsconfig.json`** - JavaScript/TypeScript configuration
  - Enables IntelliSense for p5.js in VS Code
  - Provides better code completion and error checking

### Libraries

- **`libraries/p5.min.js`** - The p5.js creative coding library
  - Provides canvas drawing, animation, and interaction capabilities
  - Core dependency for the entire game

- **`libraries/p5.sound.min.js`** - p5.js sound library
  - Enables audio capabilities (currently unused but available for expansion)

## How to Play

### Setup
1. Open `index.html` in a web browser
2. Connect a USB gamepad (optional - keyboard controls available)

### Controls

#### Keyboard Controls
- **Left Paddle:** `W` (up) / `S` (down)
- **Right Paddle:** `↑` (up) / `↓` (down)
- **Restart Game:** `Space` (after game ends)
- **Change Background Colors:** `C`
- **Switch Background Type:** `B` (toggles between simple and dynamic)

#### Gamepad Controls
- **Left Paddle:** Left analog stick Y-axis OR D-pad up/down
- **Right Paddle:** Right analog stick Y-axis OR Y/A buttons
- **Restart Game:** Start button (after game ends)
- **Change Background Colors:** `C` key (keyboard only)
- **Switch Background Type:** `B` key (keyboard only)
- **Debug Gamepad:** `G` key (shows controller input in console)

### Gameplay
- First player to score 7 points wins
- Ball speed increases slightly after each paddle hit
- Ball direction changes based on where it hits the paddle

## Gamepad Support

This game automatically detects USB gamepads using the HTML5 Gamepad API. Your gamepad will be recognized when connected, and you'll see a console message confirming the connection.

**Supported Gamepad Features:**
- Analog stick movement with deadzone filtering
- D-pad and face button alternatives
- Hot-plugging (connect/disconnect during gameplay)
- Fallback to keyboard if gamepad disconnected

## Dual Background System

This game features two distinct background systems that you can switch between:

### Dynamic Backgrounds (Default)
- Complex animated effects with breathing, pulsing, and drifting elements
- Individual element properties for independent movement
- Dynamic shadow effects and gradient sizing
- Multiple visual motifs with swaying and rotation
- Higher visual complexity for immersive experience

### Simple Backgrounds
- Clean, static backgrounds with minimal visual effects
- Better performance on lower-end devices
- Distraction-free gameplay for competitive play
- Basic color schemes without animation

### Background Controls
- **`C` key** - Cycle through different color schemes (works in both modes)
- **`B` key** - Toggle between Simple and Dynamic background types
- Both systems share the same color palettes but with different visual complexity

## Modular System

This project now uses a modern ES6 module system, similar to Python's import system but for JavaScript.

### How Modules Work in Web Development

**ES6 Modules (like Python imports):**
```javascript
// Import specific functions/classes
import { GamepadManager } from './gamepad.js';

// Import everything
import * as Gamepad from './gamepad.js';

// Export from a module
export { GamepadManager };
```

**Benefits:**
- **Encapsulation** - Each module has its own scope
- **Reusability** - Modules can be used across projects
- **Maintainability** - Easier to debug and update
- **Tree Shaking** - Only import what you need

### Gamepad Module

The `gamepad.js` module provides a clean interface for controller input:

```javascript
// Create gamepad manager
const gamepadManager = new GamepadManager();

// In your game loop
gamepadManager.update();

// Check inputs
const movement = gamepadManager.getMovementInput();
const isAPressed = gamepadManager.isButtonPressed('A');
const leftStick = gamepadManager.getLeftStick();

// Debug controller
gamepadManager.debugInputs(); // Call with 'G' key
```

**Custom Button Mapping:**
If your controller has different button mappings, you can customize them:
```javascript
gamepadManager.setCustomMapping({
  A: 1,      // If A button is at index 1 instead of 0
  START: 8,  // If start button is at index 8 instead of 9
});
```

### Background System

The current background system uses a manager pattern to switch between two background types:

```javascript
// Create background manager
const backgroundManager = new BackgroundManager();

// Initialize both background systems
backgroundManager.init();

// In your draw loop
backgroundManager.draw();

// Switch background types
backgroundManager.toggleBackgroundType(); // Simple ↔ Dynamic

// Change color schemes
backgroundManager.nextColorScheme();
```

**Background Architecture:**
- **BackgroundManager** - Unified interface for switching between background types
- **Dynamic Backgrounds** - Complex animations with independent element movement
- **Simple Backgrounds** - Static, performance-optimized backgrounds
- Shared color schemes across both background types
```

## For Beginners

### What is p5.js?

p5.js is a JavaScript library that makes coding creative and interactive projects accessible. It provides:
- Easy canvas drawing functions
- Built-in animation loop
- Simple event handling (mouse, keyboard, gamepad)
- Beginner-friendly syntax

### Key p5.js Concepts in This Game

- **`setup()`** - Runs once when the program starts
- **`draw()`** - Runs continuously (game loop)
- **Canvas** - The drawing area where everything appears
- **Coordinates** - (0,0) is top-left, X increases right, Y increases down
- **Game Objects** - JavaScript objects representing paddles and ball

### Learning Path

1. **Start with p5.js basics** - Learn drawing functions and the animation loop
2. **Study the game logic** - How paddles move and ball bounces
3. **Experiment with backgrounds** - Create your own visual effects
4. **Add features** - Sound effects, power-ups, different game modes
5. **Advanced topics** - Multiplayer networking, AI opponents

## Development Tips

### Running Locally
- Use a local web server to avoid CORS issues
- Try VS Code's Live Server extension
- Or use Python: `python -m http.server 8000`

### Debugging
- Open browser Developer Tools (F12)
- Check console for gamepad connection messages
- Use `console.log()` to debug game state

### Extending the Game
- Add sound effects using p5.sound.js
- Create power-ups or special ball types
- Implement AI for single-player mode
- Add particle effects for collisions
- Create multiple game modes

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- Gamepad API support (Chrome, Firefox, Safari, Edge)
- No additional plugins required

## License

This is an educational project. Feel free to modify and learn from the code!
