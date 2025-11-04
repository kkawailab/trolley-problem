# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

トロッコ問題（Trolley Problem）- An interactive web application that presents classic ethical dilemmas through the trolley problem thought experiment. Players make difficult moral choices while driving a car, and the application tracks decision times and compares choices with other players.

**Tech Stack**: Pure Vanilla JavaScript, HTML5, CSS3 (no dependencies or build tools)

**Language**: Japanese (all UI, content, and documentation)

## Running the Application

Simply open `index.html` in a web browser. No build process, server, or dependencies required.

For development with live reload:
```bash
python3 -m http.server 8000
# or
npx serve
```

## Architecture

### Core Files

- **index.html** - Main markup with 4 screen states (start, game, result, final)
- **scenarios.js** - Data file containing 5 scenario definitions with choices and statistics
- **app.js** - Game logic, state management, and UI controller
- **style.css** - Styling with animations, responsive design, gradient backgrounds

### State Management

Game state is managed through the `gameState` object (app.js:2-7):
```javascript
{
    currentScenarioIndex: 0,
    startTime: null,
    choices: [],
    decisionTimes: []
}
```

### Application Flow

1. **Start Screen** → Start button triggers `startGame()` (app.js:196)
2. **Game Screen** → Displays scenario via `displayScenario()` (app.js:56), starts timer
3. **Choice Made** → `makeChoice()` (app.js:82) records decision, stops timer, advances to result
4. **Result Screen** → Shows consequence, ethics discussion, and player statistics
5. **Loop/Finish** → `nextScenario()` (app.js:128) either loads next scenario or shows final results

### Screen System

Screens use a single-active pattern controlled by `showScreen()` (app.js:30). Only one screen has the `.active` class at a time, making it visible.

### Timer Mechanism

- `startTimer()` (app.js:36) - Begins at scenario load, updates every 100ms
- `stopTimer()` (app.js:45) - Called on choice, records final decision time
- Timer state stored in `gameState.decisionTimes[]`

### Keyboard Support

Arrow keys (← →) work as alternative inputs during game screen (app.js:209-217).

## Data Structure

### Scenario Object (scenarios.js)

Each scenario contains:
- `id`, `title`, `description` - Basic scenario info
- `leftChoice` / `rightChoice` - Each with `title`, `description`, `consequence`, and `stats`
- `ethics` - Post-choice philosophical reflection
- `stats` - Simulated player choice percentages (static data, not real-time)

## Modifying Content

### Adding New Scenarios

Add new scenario objects to the `scenarios` array in scenarios.js. The game automatically handles any number of scenarios and updates the counter display.

### Changing Statistics

Statistics in `stats: { left: X, right: Y }` are hardcoded percentages representing simulated player choices. These are not dynamically calculated from actual user data.

### Styling Updates

CSS uses CSS custom properties via gradient values. Key color scheme:
- Primary: `#667eea` to `#764ba2` (purple gradient)
- Animations: `fadeIn`, `roadMove`, `carShake`

## Important Implementation Details

### No Backend/Persistence

This is a client-side only application. User choices are not persisted or sent anywhere. Each session is isolated.

### Japanese Content

All strings are in Japanese. When modifying text content, maintain Japanese language consistency throughout scenarios, UI labels, and ethics discussions.

### Responsive Design

Mobile breakpoint at 768px switches choice buttons from side-by-side grid to stacked layout (style.css:420-447).

### Timer Precision

Timer displays to 0.1 second precision (100ms intervals) but calculates from `Date.now()` for accuracy (app.js:39-40, 50).
