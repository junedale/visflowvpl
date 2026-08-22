# Beginner Workspace Design

## Goal

Help first-time programmers create, connect, and run a small visual program without requiring external documentation.

## Decisions

- Preserve the Material 3 workspace and provide dark and light themes through semantic tokens.
- Keep the canvas as the primary workspace; the palette can collapse to preserve space.
- Teach the first core loop in-context: connect `Start` to `Println`, set a value, then run it.
- Make destructive actions explicit and recoverable through confirmation and existing undo support.

## Implemented Scope

- Persistent dark/light theme control.
- Collapsible, searchable node palette with collapsible categories and accessible tabs.
- First-program guide on launch, dismissible and persisted locally.
- Fit-graph canvas control and persisted viewport transform on save.
- Theme-aware canvas node surfaces.
- Confirmation before deleting graph nodes, wires, variables, or functions.

## Follow-up Scope

- Native drag-and-drop from the palette to a canvas coordinate.
- Minimap and selection inspector.
- Full keyboard graph editing and guided lesson library.

## Verification

- `npm.cmd run typecheck`
- `npm.cmd test`
- `npm.cmd run build`
