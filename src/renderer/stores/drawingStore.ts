import { writable } from 'svelte/store';

export interface DrawCommand {
  type: 'line' | 'circle' | 'rect' | 'text';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  radius?: number;
  width?: number;
  height?: number;
  color: string;
  size: number;
  fill?: boolean;
}

export interface TurtleState {
  x: number;
  y: number;
  heading: number; // degrees: 0 = East, 90 = North (or 0 = North, let's use 0 = East/Right)
  penDown: boolean;
  penColor: string;
  penSize: number;
  commands: DrawCommand[];
  autoClearOnRun: boolean;
}

const initialTurtleState: TurtleState = {
  x: 0,
  y: 0,
  heading: 90, // Facing North / Up
  penDown: true,
  penColor: '#38bdf8',
  penSize: 2,
  commands: [],
  autoClearOnRun: true,
};

function createDrawingStore() {
  const { subscribe, set, update } = writable<TurtleState>(initialTurtleState);

  return {
    subscribe,

    reset: () => {
      set({
        x: 0,
        y: 0,
        heading: 90,
        penDown: true,
        penColor: '#38bdf8',
        penSize: 2,
        commands: [],
        autoClearOnRun: true,
      });
    },

    clearCanvas: () => {
      update((s) => ({ ...s, commands: [] }));
    },

    setPenDown: (down: boolean) => {
      update((s) => ({ ...s, penDown: down }));
    },

    setPenColor: (color: string) => {
      update((s) => ({ ...s, penColor: color || '#38bdf8' }));
    },

    setPenSize: (size: number) => {
      update((s) => ({ ...s, penSize: Math.max(1, size || 2) }));
    },

    turnRight: (deg: number) => {
      update((s) => ({
        ...s,
        heading: (s.heading - deg + 360) % 360,
      }));
    },

    turnLeft: (deg: number) => {
      update((s) => ({
        ...s,
        heading: (s.heading + deg) % 360,
      }));
    },

    forward: (distance: number) => {
      update((s) => {
        const rad = (s.heading * Math.PI) / 180;
        const newX = s.x + distance * Math.cos(rad);
        const newY = s.y + distance * Math.sin(rad);

        const newCommands = [...s.commands];
        if (s.penDown) {
          newCommands.push({
            type: 'line',
            x1: s.x,
            y1: s.y,
            x2: newX,
            y2: newY,
            color: s.penColor,
            size: s.penSize,
          });
        }

        return {
          ...s,
          x: newX,
          y: newY,
          commands: newCommands,
        };
      });
    },

    backward: (distance: number) => {
      update((s) => {
        const rad = (s.heading * Math.PI) / 180;
        const newX = s.x - distance * Math.cos(rad);
        const newY = s.y - distance * Math.sin(rad);

        const newCommands = [...s.commands];
        if (s.penDown) {
          newCommands.push({
            type: 'line',
            x1: s.x,
            y1: s.y,
            x2: newX,
            y2: newY,
            color: s.penColor,
            size: s.penSize,
          });
        }

        return {
          ...s,
          x: newX,
          y: newY,
          commands: newCommands,
        };
      });
    },

    drawCircle: (radius: number, fill: boolean = false) => {
      update((s) => ({
        ...s,
        commands: [
          ...s.commands,
          {
            type: 'circle',
            x: s.x,
            y: s.y,
            radius: Math.abs(radius),
            color: s.penColor,
            size: s.penSize,
            fill,
          },
        ],
      }));
    },

    drawRect: (width: number, height: number, fill: boolean = false) => {
      update((s) => ({
        ...s,
        commands: [
          ...s.commands,
          {
            type: 'rect',
            x: s.x,
            y: s.y,
            width,
            height,
            color: s.penColor,
            size: s.penSize,
            fill,
          },
        ],
      }));
    },
  };
}

export const drawingStore = createDrawingStore();
