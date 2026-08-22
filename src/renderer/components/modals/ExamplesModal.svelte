<script lang="ts">
  import { graphStore } from '../../stores/graphStore.js';
  import { fileStore } from '../../stores/fileStore.js';
  import { showToast } from '../../stores/toastStore.js';
  import {
    createNodeFromTemplate,
    createVariableNode,
    createFunctionEntryNode,
    createReturnNode,
  } from '../../../canvas/nodeTemplates.js';
  import type { NodeData, WireData, VisflowFile } from '../../../types/flow.js';
  import { nanoid } from 'nanoid';

  export let onClose: () => void;

  interface ExampleProject {
    id: string;
    title: string;
    category: string;
    icon: string;
    description: string;
    tag: string;
    build: () => VisflowFile;
  }

  const examples: ExampleProject[] = [
    {
      id: 'spiral_art',
      title: 'Rainbow Spiral Mandala',
      category: '🎨 Turtle Graphics',
      icon: '🌀',
      tag: 'Generative Art',
      description: 'Draws an intricate geometric rainbow spiral pattern on the Turtle Graphics canvas using counted loops, forward steps, and angle turns.',
      build: () => {
        const start = createNodeFromTemplate('start', { x: 80, y: 120 });
        const clear = createNodeFromTemplate('clearcanvas', { x: 260, y: 120 });
        const penSize = createNodeFromTemplate('pensize', { x: 440, y: 120 });
        penSize.input[0].value = 2;

        const penColor = createNodeFromTemplate('pencolor', { x: 630, y: 120 });
        penColor.input[0].value = '#38bdf8';

        const loop = createNodeFromTemplate('forloop', { x: 830, y: 120 });
        loop.input[0].value = 1;
        loop.input[1].value = 60; // 60 iterations

        // Inside Loop Body: Multiply step size, forward, turn right
        const mult = createNodeFromTemplate('multiply', { x: 830, y: 340 });
        mult.input[1].value = 3; // step size = i * 3

        const fwd = createNodeFromTemplate('forward', { x: 1050, y: 220 });
        const turn = createNodeFromTemplate('turnright', { x: 1240, y: 220 });
        turn.input[0].value = 61; // 61 degree turn creates hexagonal spiral mandala!

        const note = createNodeFromTemplate('comment', { x: 80, y: 280 });
        note.commentText = '🎨 Rainbow Spiral Art:\nClick "▶ Run" to watch the Turtle draw a geometric mandala spiral live on the Turtle Canvas tab!';

        const wires: WireData[] = [
          { id: `w_${nanoid(8)}`, originPortId: Object.values(start.next)[0].id, targetPortId: Object.values(clear.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(clear.next)[0].id, targetPortId: Object.values(penSize.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(penSize.next)[0].id, targetPortId: Object.values(penColor.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(penColor.next)[0].id, targetPortId: Object.values(loop.previous)[0].id },
          // Loop Body -> Forward -> Turn
          { id: `w_${nanoid(8)}`, originPortId: Object.values(loop.next)[1].id, targetPortId: Object.values(fwd.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(fwd.next)[0].id, targetPortId: Object.values(turn.previous)[0].id },
          // Data: Loop Index -> Multiply -> Forward Distance
          { id: `w_${nanoid(8)}`, originPortId: Object.values(loop.output)[0].id, targetPortId: Object.values(mult.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(mult.output)[0].id, targetPortId: Object.values(fwd.input)[0].id },
        ];

        return {
          version: '1.0.0',
          nodes: { nodeData: [start, clear, penSize, penColor, loop, mult, fwd, turn, note], wireData: wires },
          variables: [],
          functions: [],
        };
      },
    },

    {
      id: 'chiptune_song',
      title: '8-Bit Retro Melody Arpeggiator',
      category: '🎵 Sound & Music',
      icon: '🎹',
      tag: 'WebAudio Synth',
      description: 'Plays a classic retro video game arpeggio melody using sound synthesis, musical note array iteration, and victory chimes.',
      build: () => {
        const start = createNodeFromTemplate('start', { x: 80, y: 120 });
        const sfx = createNodeFromTemplate('playsound', { x: 260, y: 120 });
        sfx.input[0].value = 'coin';

        const print = createNodeFromTemplate('println', { x: 460, y: 120 });
        print.input[0].value = 'Playing 8-bit chiptune jingle...';

        const n1 = createNodeFromTemplate('playnote', { x: 660, y: 120 });
        n1.input[0].value = 'C4';
        n1.input[1].value = 180;

        const n2 = createNodeFromTemplate('playnote', { x: 860, y: 120 });
        n2.input[0].value = 'E4';
        n2.input[1].value = 180;

        const n3 = createNodeFromTemplate('playnote', { x: 1060, y: 120 });
        n3.input[0].value = 'G4';
        n3.input[1].value = 180;

        const n4 = createNodeFromTemplate('playnote', { x: 1260, y: 120 });
        n4.input[0].value = 'C5';
        n4.input[1].value = 300;

        const winSfx = createNodeFromTemplate('playsound', { x: 1460, y: 120 });
        winSfx.input[0].value = 'win';

        const note = createNodeFromTemplate('comment', { x: 80, y: 280 });
        note.commentText = '🎵 Chiptune Jingle:\nClick "▶ Run" to hear WebAudio generate an arpeggio chord followed by a victory fanfare sound effect!';

        const wires: WireData[] = [
          { id: `w_${nanoid(8)}`, originPortId: Object.values(start.next)[0].id, targetPortId: Object.values(sfx.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(sfx.next)[0].id, targetPortId: Object.values(print.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(print.next)[0].id, targetPortId: Object.values(n1.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(n1.next)[0].id, targetPortId: Object.values(n2.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(n2.next)[0].id, targetPortId: Object.values(n3.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(n3.next)[0].id, targetPortId: Object.values(n4.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(n4.next)[0].id, targetPortId: Object.values(winSfx.previous)[0].id },
        ];

        return {
          version: '1.0.0',
          nodes: { nodeData: [start, sfx, print, n1, n2, n3, n4, winSfx, note], wireData: wires },
          variables: [],
          functions: [],
        };
      },
    },

    {
      id: 'number_guess',
      title: 'Number Guessing Mini-Game',
      category: '🎮 Interactive Game',
      icon: '🎯',
      tag: 'Game Logic',
      description: 'An interactive game where the computer picks a random secret number (1-100) and you guess it in the terminal with higher/lower hints.',
      build: () => {
        const start = createNodeFromTemplate('start', { x: 80, y: 120 });
        const secretVar = createVariableNode('secret', 'number', 0, { x: 270, y: 120 });
        const rand = createNodeFromTemplate('random', { x: 80, y: 280 });
        rand.input[0].value = 1;
        rand.input[1].value = 50;

        const introPrint = createNodeFromTemplate('println', { x: 470, y: 120 });
        introPrint.input[0].value = '=== Guess the Number (1-50) ===';

        const promptInput = createNodeFromTemplate('input', { x: 470, y: 280 });
        promptInput.input[0].value = 'Enter your guess:';

        const guessVar = createVariableNode('guess', 'number', 0, { x: 700, y: 120 });
        const toNum = createNodeFromTemplate('add', { x: 700, y: 280 }); // cast via + 0
        toNum.input[1].value = 0;

        const checkEqual = createNodeFromTemplate('equal', { x: 920, y: 280 });
        const ifNode = createNodeFromTemplate('ifelse', { x: 920, y: 120 });

        const winPrint = createNodeFromTemplate('println', { x: 1150, y: 60 });
        winPrint.input[0].value = '🎉 Correct! You won!';
        const winSfx = createNodeFromTemplate('playsound', { x: 1350, y: 60 });
        winSfx.input[0].value = 'win';

        const losePrint = createNodeFromTemplate('println', { x: 1150, y: 220 });
        losePrint.input[0].value = 'Try again next time!';

        const note = createNodeFromTemplate('comment', { x: 80, y: 440 });
        note.commentText = '🎯 Number Guessing Game:\nClick "▶ Run", type your guess in the bottom terminal prompt, and test your luck!';

        const wires: WireData[] = [
          { id: `w_${nanoid(8)}`, originPortId: Object.values(start.next)[0].id, targetPortId: Object.values(secretVar.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(rand.output)[0].id, targetPortId: Object.values(secretVar.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(secretVar.next)[0].id, targetPortId: Object.values(introPrint.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(introPrint.next)[0].id, targetPortId: Object.values(guessVar.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(promptInput.output)[0].id, targetPortId: Object.values(toNum.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(toNum.output)[0].id, targetPortId: Object.values(guessVar.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(guessVar.next)[0].id, targetPortId: Object.values(ifNode.previous)[0].id },
          // Condition: guess == secret
          { id: `w_${nanoid(8)}`, originPortId: Object.values(guessVar.output)[0].id, targetPortId: Object.values(checkEqual.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(secretVar.output)[0].id, targetPortId: Object.values(checkEqual.input)[1].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(checkEqual.output)[0].id, targetPortId: Object.values(ifNode.input)[0].id },
          // True -> Win print -> Win SFX
          { id: `w_${nanoid(8)}`, originPortId: Object.values(ifNode.next)[1].id, targetPortId: Object.values(winPrint.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(winPrint.next)[0].id, targetPortId: Object.values(winSfx.previous)[0].id },
          // False -> Lose print
          { id: `w_${nanoid(8)}`, originPortId: Object.values(ifNode.next)[2].id, targetPortId: Object.values(losePrint.previous)[0].id },
        ];

        return {
          version: '1.0.0',
          nodes: { nodeData: [start, rand, secretVar, introPrint, promptInput, toNum, guessVar, checkEqual, ifNode, winPrint, winSfx, losePrint, note], wireData: wires },
          variables: [{ name: 'secret', dataType: 'number', value: 0 }, { name: 'guess', dataType: 'number', value: 0 }],
          functions: [],
        };
      },
    },

    {
      id: 'array_sort',
      title: 'Array Operations & Length Inspector',
      category: '📊 Algorithms',
      icon: '🧮',
      tag: 'Data Structures',
      description: 'Demonstrates array creation, pushing values, indexing, and formatted output reporting to the terminal.',
      build: () => {
        const start = createNodeFromTemplate('start', { x: 80, y: 120 });
        const arrNode = createNodeFromTemplate('createarray', { x: 80, y: 260 });
        arrNode.input[0].value = 10;
        arrNode.input[1].value = 25;
        arrNode.input[2].value = 42;

        const arrVar = createVariableNode('scores', 'array', [10, 25, 42], { x: 280, y: 120 });
        const pushNode = createNodeFromTemplate('arraypush', { x: 500, y: 120 });
        pushNode.input[1].value = 99;

        const print = createNodeFromTemplate('println', { x: 720, y: 120 });
        const getLen = createNodeFromTemplate('arraylength', { x: 500, y: 280 });

        const note = createNodeFromTemplate('comment', { x: 80, y: 440 });
        note.commentText = '📊 Array Demonstration:\nCreates an array, pushes 99, and calculates the total length!';

        const wires: WireData[] = [
          { id: `w_${nanoid(8)}`, originPortId: Object.values(start.next)[0].id, targetPortId: Object.values(arrVar.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(arrNode.output)[0].id, targetPortId: Object.values(arrVar.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(arrVar.next)[0].id, targetPortId: Object.values(pushNode.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(arrVar.output)[0].id, targetPortId: Object.values(pushNode.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(pushNode.next)[0].id, targetPortId: Object.values(print.previous)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(arrVar.output)[0].id, targetPortId: Object.values(getLen.input)[0].id },
          { id: `w_${nanoid(8)}`, originPortId: Object.values(getLen.output)[0].id, targetPortId: Object.values(print.input)[0].id },
        ];

        return {
          version: '1.0.0',
          nodes: { nodeData: [start, arrNode, arrVar, pushNode, getLen, print, note], wireData: wires },
          variables: [{ name: 'scores', dataType: 'array', value: [10, 25, 42] }],
          functions: [],
        };
      },
    },
  ];

  function loadExample(example: ExampleProject) {
    const data = example.build();
    graphStore.loadProject(data);
    fileStore.newFile();
    showToast(`Loaded "${example.title}" template!`, 'success');
    onClose();
  }
</script>

<div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
  <div class="w-full max-w-2xl bg-surface-container border border-surface-container-high rounded-3xl shadow-m3-5 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/60">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-m3-primary/10 text-m3-primary border border-m3-primary/20 flex items-center justify-center text-base">
          ✨
        </div>
        <div>
          <h2 class="text-base font-bold text-m3-on-surface">Starter Examples & Mini-Games</h2>
          <p class="text-xs text-m3-outline">Click any template to load and play it immediately on the canvas</p>
        </div>
      </div>
      <button
        class="w-7 h-7 flex items-center justify-center rounded-full text-m3-outline hover:text-m3-on-surface hover:bg-surface-container-high transition-colors"
        on:click={onClose}
      >
        ✕
      </button>
    </div>

    <!-- Cards List -->
    <div class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5 custom-scrollbar">
      {#each examples as ex (ex.id)}
        <div class="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest hover:border-m3-primary/50 transition-all flex flex-col justify-between group shadow-sm">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-2xl">{ex.icon}</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container-highest text-m3-primary">
                {ex.tag}
              </span>
            </div>
            <div>
              <div class="text-xs font-bold text-m3-on-surface group-hover:text-m3-primary transition-colors">
                {ex.title}
              </div>
              <div class="text-[11px] text-m3-outline/90 mt-1 leading-relaxed">
                {ex.description}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between">
            <span class="text-[10px] text-m3-outline font-medium">{ex.category}</span>
            <button
              class="px-3 py-1.5 rounded-full text-xs font-semibold bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 active:scale-95 transition-all shadow-sm flex items-center gap-1"
              on:click={() => loadExample(ex)}
            >
              <span>Load Template</span>
              <span>→</span>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
