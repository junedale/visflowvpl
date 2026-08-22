# VisFlow Architecture & Technical Specification

This document details the system design, data flow, component hierarchy, and compiler/interpreter pipeline of VisFlow VPL.

---

## 1. System Overview

VisFlow consists of three decoupled layers:

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                    │
│   Svelte 5 App + Konva Stage + Tabbed Console & Drawing     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Dispatches Actions / Reads Stores
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    State & Compilation Layer                │
│   graphStore ──► generator.ts ──► VisLang Source Code       │
└──────────────────────────────┬──────────────────────────────┘
                               │ Emits Source & Debug Hooks
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Execution Layer                        │
│   ANTLR4 Lexer/Parser ──► VisLangEvaluator ──► I/O, Audio,  │
│                                                Turtle Art   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Data Models

### `NodeData`
Represents an individual functional or structural node placed on the 2D stage.

```typescript
export interface NodeData {
  id: string;
  title: string;
  type: 'core' | 'variable' | 'function' | 'comment';
  category: Category;
  dataType?: DataType;
  width?: number;
  height?: number;
  position: { x: number; y: number };
  previous?: Record<number, PortData>; // Execution In
  next?: Record<number, PortData>;     // Execution Out
  input?: Record<number, PortData>;    // Data In
  output?: Record<number, PortData>;   // Data Out
  commentText?: string;
}
```

### `WireData`
Represents a directed execution or data link between two ports.

```typescript
export interface WireData {
  id: string;
  originPortId: string;
  targetPortId: string;
}
```

---

## 3. Canvas Rendering & Reconciliation Pipeline (`StageManager.ts`)

`StageManager` manages the Konva canvas surface through a layered architecture:

- **`nodeLayer`**: Contains node cards, title bars, sockets, labels, and inline editable text values.
- **`wireLayer`**: Contains static cubic bezier splines with dynamic data-type color coding.
- **`dragWireLayer`**: Interactive live wire dragging and executing glowing electricity flow particles.
- **`selectionLayer`**: Multi-select marquee boundary box and active step node highlight ring.

### Incremental Diffing
Rather than teardown and recreate the DOM/Canvas tree on each store mutation, `StageManager.renderGraph` computes sets of added, modified, and removed nodes/wires, executing localized updates in `O(N)` time.

---

## 4. Compiler & Code Generator (`generator.ts`)

The compiler traverses execution wires starting from the `start` entry point (or function entry nodes) to emit idiomatic VisLang code.

### Traversal Logic
1. Follows `next` ports in execution sequence.
2. For control flow nodes (`ifelse`, `whileloop`, `forloop`), recursively builds nested code blocks with standardized indentation.
3. For data inputs (`parseInputPort`), recursively traces backwards through connected `output` ports or resolves literal values.
4. When stepping or delayed execution is requested, injects `__step__("node_id")` hooks before every node statement.

---

## 5. Grammar & Interpreter (`evaluator.ts`)

VisLang is defined by the formal grammar in [`src/grammar/VisLang.g4`](file:///C:/Users/Junedale%20Gayeta/Documents/Projects/visflowvpl/src/grammar/VisLang.g4).

### Execution Pipeline:
1. `CharStreams.fromString(code)`
2. `VisLangLexer` Tokenizer
3. `VisLangParser` AST Construction
4. `VisLangEvaluator` (extends `VisLangVisitor<any>`) evaluates the AST with:
   - Lexical Scope hierarchy (`Environment`)
   - Standard Library Builtins (Math, Strings, Arrays)
   - Procedural Turtle Graphics Engine (`drawingStore`)
   - WebAudio retro sound synthesis (`audioService`)
   - Async sleep and step breakpoints (`runner.ts`)
