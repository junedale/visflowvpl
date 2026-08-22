# VisFlow VPL

<div align="center">

### _Visual Flow-Based Programming Language & Creative Coding Studio_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Svelte](https://img.shields.io/badge/Svelte-5.x-orange.svg)](https://svelte.dev/)
[![Konva](https://img.shields.io/badge/Konva-8.x-0284c7.svg)](https://konvajs.org/)
[![ANTLR4](https://img.shields.io/badge/ANTLR-4.x-red.svg)](https://www.antlr.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-brightgreen.svg)](https://vitest.dev/)

*VisFlow is a visual programming environment and execution engine designed to make learning programming intuitive, engaging, and deeply interactive through visual nodes, procedural vector graphics, chiptune sound synthesis, and real-time step debugging.*

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Shortcuts](#-keyboard-shortcuts) • [Examples](#-starter-templates--mini-games)

---

</div>

## 🌟 Key Features

### 🎨 1. Turtle Graphics & Vector Art Canvas
- **Procedural 2D Drawing**: Move, turn, and draw on a dedicated 2D vector graphics canvas using standard Turtle commands (`Forward`, `Backward`, `Turn Right/Left`, `Pen Up/Down`, `Pen Color`, `Pen Size`).
- **Geometric Primitives**: Built-in `Draw Circle`, `Draw Rect`, `Clear Canvas`, and `Reset Turtle` nodes.
- **Interactive Viewport**: Zoom, pan, inspect coordinates in real time, and export artworks with 1-click **Save PNG**.

### 🎵 2. WebAudio Synthesizer & Sound FX
- **Musical Notes**: Play pitch notes with customizable octave and duration (`C4`, `E4`, `G4`, `A5`, etc.).
- **Frequency Tones**: Play raw frequency tones (Hz) with sine, square, sawtooth, or triangle waveforms.
- **Procedural Retro SFX**: Built-in 8-bit sound effects (`coin`, `laser`, `jump`, `win`, `explosion`, `pop`).

### ⚡ 3. Visual Flow Electricity & Smart Wire-Drop
- **Animated Wire Electricity**: Glowing electric particle pulses travel along active wires during program execution.
- **Smart Wire-Drop Quick-Connect**: Drag any port onto empty canvas space to open a context search palette pre-filtered for compatible connections, automatically creating and wiring the new node upon selection.
- **Intelligent Snapping**: Ports highlight and snap within range with real-time data-type compatibility checks.

### 📐 4. Hierarchical Auto-Layout Beautifier
- **1-Click Graph Beautification**: Automatically organizes messy spaghetti nodes into tidy left-to-right hierarchical columns with uniform grid spacing via the `📐 Beautify` button or <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>.

### 🐞 5. Multi-Speed Debugger & Live Variable Watch
- **Execution Speeds**: Run at `⚡ Instant`, `🐇 100ms`, `⏱ 300ms`, `🐢 800ms`, or `⏭ Step-by-Step`.
- **Live Node Highlighting**: Follow along as execution flows through each branch of your visual logic.
- **Live Variable Watch**: Real-time inspector grid showing current values, types, and array contents.

### ✨ 6. Starter Examples & Mini-Game Gallery
1-click playable example projects built right into the app:
- 🌀 **Rainbow Spiral Mandala**: Generative geometry using loops and turtle graphics.
- 🎹 **8-Bit Retro Melody Arpeggiator**: Chiptune music using WebAudio note arrays.
- 🎯 **Number Guessing Mini-Game**: Interactive terminal game with random numbers and victory sound effects.
- 📊 **Array Operations & Length Inspector**: List manipulation, indexing, and formatted output.

---

## 🏗 Architecture

```
                               ┌─────────────────────────────┐
                               │   Konva HTML5 2D Canvas     │
                               │  (Nodes, Wires, Particles)  │
                               └──────────────┬──────────────┘
                                              │ User Graph
                                              ▼
┌───────────────────────────┐      ┌─────────────────────────┐
│   Code Generator          │ ───► │  VisLang Code (.vl)     │
│   (AST Generation)        │      └──────────┬──────────────┘
└───────────────────────────┘                 │
                                              ▼
┌───────────────────────────┐      ┌─────────────────────────┐
│  ANTLR4 Lexer & Parser    │ ───► │  Parse Tree / AST       │
└───────────────────────────┘      └──────────┬──────────────┘
                                              │
                                              ▼
┌───────────────────────────┐      ┌─────────────────────────┐
│  VisLang Evaluator        │ ◄─── │  Visitor Interpreter    │
│  - Call Stack & Scopes    │      │  (Environment & Memory) │
│  - Step Debugger Hooks    │      └──────────┬──────────────┘
└─────────────┬─────────────┘                 │
              │                               │
              ▼                               ▼
┌───────────────────────────┐      ┌─────────────────────────┐
│  🎨 Turtle Drawing Canvas │      │  🎵 WebAudio Synth      │
│  (drawingStore)           │      │  (audioService)         │
└───────────────────────────┘      └─────────────────────────┘
```

- **Canvas Engine**: GPU-accelerated HTML5 canvas powered by [Konva](https://konvajs.org/) with incremental graph reconciliation and batched rendering.
- **Grammar & Compiler**: ANTLR4 TypeScript grammar (`VisLang.g4`) compiling graph connections into clean structured VisLang code.
- **Runtime Interpreter**: Scoped tree-walking visitor with support for recursion, variables, arrays, first-class functions, and interactive terminal I/O.
- **UI Framework**: Svelte 5 + Tailwind CSS styled according to Material Design 3 guidelines.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/junedale/visflowvpl.git
   cd visflowvpl
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Launch the Electron Desktop app:**
   ```bash
   npm start
   ```

---

## 🧪 Testing & Verification

VisFlow includes an automated unit and runtime test suite powered by [Vitest](https://vitest.dev/):

```bash
# Run all unit and integration tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Build production bundle
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Right Click</kbd> | Open Node Quick-Add Context Palette |
| <kbd>Drag Port to Canvas</kbd> | Wire-Drop Quick-Connect Auto-Wiring |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | Delete selected node(s) and connected wires |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Undo canvas action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Redo canvas action |
| <kbd>Ctrl</kbd> + <kbd>D</kbd> | Duplicate selected node(s) |
| <kbd>Shift</kbd> + <kbd>Click</kbd> | Multi-select nodes |
| <kbd>Drag Canvas Background</kbd> | Marquee selection box |
| <kbd>Mouse Wheel</kbd> | Pan & Zoom canvas viewport |
| <kbd>Enter</kbd> | Commit value in node inline input field |
| <kbd>Escape</kbd> | Dismiss context menu / cancel editing |

---

## 📂 Project Structure

```
visflowvpl/
├── src/
│   ├── audio/               # WebAudio Synthesizer & Procedural Sound FX
│   │   └── audioService.ts
│   ├── canvas/              # Konva 2D Canvas Rendering & Graph Management
│   │   ├── autoLayout.ts    # Hierarchical auto-layout beautifier
│   │   ├── constants.ts     # Data types, socket colors, dimensions
│   │   ├── nodeTemplates.ts # Node definitions, ports, categories
│   │   └── stageManager.ts  # Konva Stage, wires, drag, and event handling
│   ├── compiler/            # Code Generation & Graph Validation
│   │   ├── generator.ts     # Graph -> VisLang compiler
│   │   └── validator.ts     # Graph sanity checks and diagnostics
│   ├── grammar/             # ANTLR4 VisLang language grammar
│   │   └── VisLang.g4
│   ├── interpreter/         # Runtime AST Interpreter & Scoped Environment
│   │   ├── environment.ts   # Lexical scopes, call frames, variables
│   │   ├── evaluator.ts     # AST Visitor with math, strings, arrays, turtle, audio
│   │   ├── runner.ts        # Execution controller, speed delays, step debugging
│   │   └── runtime.ts       # Unified evaluator entry point
│   ├── renderer/            # Svelte UI Components & State Stores
│   │   ├── components/      # Navbar, Sidebar, Canvas, Console, DrawingCanvas
│   │   └── stores/          # graphStore, consoleStore, drawingStore, fileStore
│   └── types/               # TypeScript interface definitions
├── tests/                   # Vitest unit and runtime test suites
│   ├── runtime.test.ts
│   └── creative-features.test.ts
├── vite.config.ts           # Vite bundler configuration & code splitting
└── package.json
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
