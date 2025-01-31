/**
 * Spacecraft Control Server
 * This server manages the state and actions of a spacecraft system
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
// Middleware setup

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/**
 * Spacecraft state object containing all vital information
 */
let spacecraftState = {
    batteryPercentage: 85,          // Current battery level (0-100)
    activeSensors: ["Temperature", "Camera"], // Array of active sensor names
    discoveredResources: ["Iron Ore", "Silver"], // Array of found resources
    movement: "stationary",         // Current movement state
    sleepMode: false,              // Sleep mode status
    temperature: generateRandomTemp(), // Current temperature
    lastResource: null             // Last discovered resource
};

/**
 * Generates a random temperature between -20 and 80 degrees
 */
function generateRandomTemp() {
    return Math.floor(Math.random() * 100) - 20; // -20 to 80 degrees
}

/**
 * Selects a random resource from available options
 */
function discoverRandomResource() {
    const resources = ['Gold', 'Silver', 'Iron Ore', 'Platinum', 'Diamond'];
    return resources[Math.floor(Math.random() * resources.length)];
}

/**
 * GET endpoint for spacecraft status
 * Returns current state information
 */
app.get('/status', (req, res) => {
    res.json({
        batteryPercentage: spacecraftState.batteryPercentage,
        activeSensors: spacecraftState.activeSensors,
        discoveredResources: spacecraftState.discoveredResources,
        movement: spacecraftState.movement,
        sleepMode: spacecraftState.sleepMode
    });
});

/**
 * POST endpoint for spacecraft actions
 * Handles different types of commands: movement, sensors, sleep mode, and recharging
 */
app.post('/action', (req, res) => {
    const { actionType, actionDetails } = req.body;

    switch (actionType) {
        case 'move_forward':
                        // Requires 10% battery to move forward

            if (spacecraftState.batteryPercentage >= 10) {
                spacecraftState.movement = 'moving forward';
                spacecraftState.batteryPercentage -= 10;
            }
            break;
        case 'move_backward':
                        // Requires 10% battery to move backward

            if (spacecraftState.batteryPercentage >= 10) {
                spacecraftState.movement = 'moving backward';
                spacecraftState.batteryPercentage -= 10;
            }
            break;
        case 'rotate':
            spacecraftState.movement = `rotating ${actionDetails}`;
            break;
        case 'sensor':
                        // Toggle sensor state (on/off)

            if (spacecraftState.activeSensors.includes(actionDetails)) {
                spacecraftState.activeSensors = spacecraftState.activeSensors.filter(
                    sensor => sensor !== actionDetails
                );
            } else {
                spacecraftState.activeSensors.push(actionDetails);
            }
            break;
        case 'sleep':
                        // Toggle sleep mode and restore battery when sleeping

            spacecraftState.sleepMode = !spacecraftState.sleepMode;
            if (spacecraftState.sleepMode) {
                spacecraftState.batteryPercentage = 95;
            }
            break;
        case 'recharge':
                        // Recharge battery with 25% increment, max 100%

            spacecraftState.batteryPercentage = Math.min(100, spacecraftState.batteryPercentage + 25);
            break;
    }

    res.json({
        message: 'Action executed successfully',
        newState: spacecraftState
    });
});

app.listen(PORT, () => {
    console.log(`Spacecraft server running at http://localhost:${PORT}`);
});
