// gamepad.js - Gamepad input handling module
// This module provides a clean interface for gamepad input

class GamepadManager {
  constructor() {
    this.gamepad = null;
    this.hasGamepad = false;
    this.deadzone = 0.2;
    this.buttonMappings = this.getDefaultButtonMappings();
    this.previousButtonStates = {};
    this.lastButtonStates = {};
    this.lastAxisStates = {};
    this.monitoringInterval = null;
    
    this.setupEventListeners();
  }
  
  // Set up gamepad connection/disconnection listeners
  setupEventListeners() {
    window.addEventListener("gamepadconnected", (e) => {
      console.log("Gamepad connected:", e.gamepad);
      this.gamepad = e.gamepad;
      this.hasGamepad = true;
      this.logGamepadInfo(e.gamepad);
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      console.log("Gamepad disconnected");
      this.hasGamepad = false;
      this.gamepad = null;
    });
  }
  
  // Log detailed gamepad information for debugging
  logGamepadInfo(gamepad) {
    console.log("=== Gamepad Connected ===");
    console.log("- ID:", gamepad.id);
    console.log("- Index:", gamepad.index);
    console.log("- Buttons:", gamepad.buttons.length);
    console.log("- Axes:", gamepad.axes.length);
    console.log("- Mapping:", gamepad.mapping);
    
    // Log the detected controller type
    const id = gamepad.id.toLowerCase();
    if (id.includes('xbox')) {
      console.log("- Detected: Xbox-style controller");
    } else if (id.includes('playstation') || id.includes('ps')) {
      console.log("- Detected: PlayStation-style controller");
    } else if (id.includes('nintendo') || id.includes('switch')) {
      console.log("- Detected: Nintendo-style controller");
    } else {
      console.log("- Detected: Generic/Unknown controller");
      console.log("- Consider custom button mapping if controls don't work");
    }
    
    // Real-time button monitoring
    console.log("Press any button to see its index...");
    this.startButtonMonitoring();
  }
  
  // Monitor button presses for mapping purposes
  startButtonMonitoring() {
    this.monitoringInterval = setInterval(() => {
      if (!this.hasGamepad) {
        clearInterval(this.monitoringInterval);
        return;
      }
      
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[this.gamepad.index];
      if (!gamepad) return;
      
      // Check for any pressed buttons
      for (let i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed && !this.lastButtonStates[i]) {
          console.log(`Button ${i} pressed (${this.getButtonName(i) || 'Unknown'})`);
        }
        this.lastButtonStates[i] = gamepad.buttons[i].pressed;
      }
      
      // Check for significant axis movement
      for (let i = 0; i < gamepad.axes.length; i++) {
        const value = gamepad.axes[i];
        if (Math.abs(value) > 0.5 && Math.abs(this.lastAxisStates[i] || 0) <= 0.5) {
          console.log(`Axis ${i}: ${value.toFixed(2)} (${this.getAxisName(i) || 'Unknown'})`);
        }
        this.lastAxisStates[i] = value;
      }
    }, 100);
  }
  
  // Default button mappings for standard gamepads
  getDefaultButtonMappings() {
    return {
      // Face buttons (PlayStation/Xbox style)
      A: 0,          // Cross/A
      B: 1,          // Circle/B  
      X: 2,          // Square/X
      Y: 3,          // Triangle/Y
      
      // Shoulder buttons
      LB: 4,         // L1/LB
      RB: 5,         // R1/RB
      LT: 6,         // L2/LT
      RT: 7,         // R2/RT
      
      // Menu buttons
      SELECT: 8,     // Select/Back
      START: 9,      // Start/Menu
      
      // Stick buttons
      LS: 10,        // Left stick click
      RS: 11,        // Right stick click
      
      // D-pad
      DPAD_UP: 12,
      DPAD_DOWN: 13,
      DPAD_LEFT: 14,
      DPAD_RIGHT: 15,
      
      // Special button (PS button, Xbox button, etc.)
      HOME: 16
    };
  }
  
  // Update gamepad state - call this every frame
  update() {
    if (!this.hasGamepad) return;
    
    // Get fresh gamepad state
    const gamepads = navigator.getGamepads();
    if (gamepads[this.gamepad.index]) {
      this.gamepad = gamepads[this.gamepad.index];
    }
  }
  
  // Apply deadzone to analog values
  applyDeadzone(value) {
    return Math.abs(value) < this.deadzone ? 0 : value;
  }
  
  // Get analog stick values
  getLeftStick() {
    if (!this.hasGamepad) return { x: 0, y: 0 };
    return {
      x: this.applyDeadzone(this.gamepad.axes[0] || 0),
      y: this.applyDeadzone(this.gamepad.axes[1] || 0)
    };
  }
  
  getRightStick() {
    if (!this.hasGamepad) return { x: 0, y: 0 };
    return {
      x: this.applyDeadzone(this.gamepad.axes[2] || 0),
      y: this.applyDeadzone(this.gamepad.axes[3] || 0)
    };
  }
  
  // Check if button is currently pressed
  isButtonPressed(buttonName) {
    if (!this.hasGamepad) return false;
    const buttonIndex = this.buttonMappings[buttonName];
    if (buttonIndex === undefined) return false;
    return this.gamepad.buttons[buttonIndex]?.pressed || false;
  }
  
  // Check if button was just pressed this frame (not held)
  isButtonJustPressed(buttonName) {
    if (!this.hasGamepad) return false;
    const buttonIndex = this.buttonMappings[buttonName];
    if (buttonIndex === undefined) return false;
    
    const isPressed = this.gamepad.buttons[buttonIndex]?.pressed || false;
    const wasPressed = this.previousButtonStates[buttonName] || false;
    
    this.previousButtonStates[buttonName] = isPressed;
    
    return isPressed && !wasPressed;
  }
  
  // Get trigger values (0-1)
  getLeftTrigger() {
    if (!this.hasGamepad) return 0;
    return this.gamepad.buttons[this.buttonMappings.LT]?.value || 0;
  }
  
  getRightTrigger() {
    if (!this.hasGamepad) return 0;
    return this.gamepad.buttons[this.buttonMappings.RT]?.value || 0;
  }
  
  // Get trigger values as movement (useful for paddle controls)
  getLeftTriggerMovement() {
    const triggerValue = this.getLeftTrigger();
    return triggerValue > 0.1 ? triggerValue : 0;
  }
  
  getRightTriggerMovement() {
    const triggerValue = this.getRightTrigger();
    return triggerValue > 0.1 ? triggerValue : 0;
  }

  // Convenience methods for common game actions
  getMovementInput() {
    const leftStick = this.getLeftStick();
    const dpadInput = {
      x: 0,
      y: 0
    };
    
    // Add D-pad input
    if (this.isButtonPressed('DPAD_LEFT')) dpadInput.x = -1;
    if (this.isButtonPressed('DPAD_RIGHT')) dpadInput.x = 1;
    if (this.isButtonPressed('DPAD_UP')) dpadInput.y = -1;
    if (this.isButtonPressed('DPAD_DOWN')) dpadInput.y = 1;
    
    // Return analog stick if significant, otherwise D-pad
    return {
      x: leftStick.x !== 0 ? leftStick.x : dpadInput.x,
      y: leftStick.y !== 0 ? leftStick.y : dpadInput.y
    };
  }
  
  // Debug method to see all current inputs
  debugInputs() {
    if (!this.hasGamepad) {
      console.log("No gamepad connected");
      return;
    }
    
    console.log("=== Gamepad Debug ===");
    console.log("Controller ID:", this.gamepad.id);
    console.log("Left Stick:", this.getLeftStick());
    console.log("Right Stick:", this.getRightStick());
    console.log("Movement:", this.getMovementInput());
    console.log("Left Trigger:", this.getLeftTrigger());
    console.log("Right Trigger:", this.getRightTrigger());
    
    // Show pressed buttons
    const pressedButtons = [];
    for (const [name, index] of Object.entries(this.buttonMappings)) {
      if (this.isButtonPressed(name)) {
        pressedButtons.push(`${name} (${index})`);
      }
    }
    console.log("Pressed buttons:", pressedButtons.length ? pressedButtons : "None");
    
    // Show raw axis values
    console.log("Raw axes:", Array.from(this.gamepad.axes).map((v, i) => `${i}:${v.toFixed(2)}`));
    
    // Show raw button states
    const activeButtons = [];
    for (let i = 0; i < this.gamepad.buttons.length; i++) {
      if (this.gamepad.buttons[i].pressed) {
        activeButtons.push(`${i}:${this.gamepad.buttons[i].value.toFixed(2)}`);
      }
    }
    console.log("Raw buttons:", activeButtons.length ? activeButtons : "None");
  }
  
  // Custom button mapping for specific controllers
  setCustomMapping(mappings) {
    this.buttonMappings = { ...this.buttonMappings, ...mappings };
  }
  
  // Method to auto-detect and suggest mappings for unknown controllers
  suggestMapping() {
    if (!this.hasGamepad) {
      console.log("No gamepad connected");
      return;
    }
    
    console.log("=== Controller Mapping Helper ===");
    console.log("Controller:", this.gamepad.id);
    console.log("\nInstructions:");
    console.log("1. Press each button/move each stick as instructed");
    console.log("2. Note the button/axis numbers that appear");
    console.log("3. Use setCustomMapping() with the correct numbers");
    console.log("\nPress buttons in this order:");
    console.log("- A/Cross button (primary action)");
    console.log("- B/Circle button (secondary action)"); 
    console.log("- X/Square button");
    console.log("- Y/Triangle button");
    console.log("- Start/Menu button");
    console.log("- Move left analog stick up/down");
    console.log("- Move right analog stick up/down");
    console.log("- Press D-pad up");
    console.log("- Press D-pad down");
    console.log("\nExample custom mapping:");
    console.log("gamepadManager.setCustomMapping({");
    console.log("  A: 0,        // Replace 0 with actual button number");
    console.log("  B: 1,        // Replace 1 with actual button number");
    console.log("  START: 9,    // Replace 9 with actual button number");
    console.log("  DPAD_UP: 12, // Replace 12 with actual button number");
    console.log("  DPAD_DOWN: 13 // Replace 13 with actual button number");
    console.log("});");
  }

  // Vibrate the gamepad (if supported)
  vibrate(duration = 200, strongMagnitude = 0.5, weakMagnitude = 0.5) {
    if (!this.hasGamepad || !this.gamepad.vibrationActuator) return;
    
    this.gamepad.vibrationActuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: duration,
      strongMagnitude: strongMagnitude,
      weakMagnitude: weakMagnitude,
    });
  }
  
  // Helper methods to get human-readable names
  getButtonName(index) {
    const reverseMapping = {};
    for (const [name, buttonIndex] of Object.entries(this.buttonMappings)) {
      reverseMapping[buttonIndex] = name;
    }
    return reverseMapping[index];
  }
  
  getAxisName(index) {
    const axisNames = {
      0: 'Left Stick X',
      1: 'Left Stick Y', 
      2: 'Right Stick X',
      3: 'Right Stick Y',
      4: 'Left Trigger',
      5: 'Right Trigger'
    };
    return axisNames[index];
  }
}

// Export for ES6 modules
export { GamepadManager };

// Also make available globally for non-module use
if (typeof window !== 'undefined') {
  window.GamepadManager = GamepadManager;
}
