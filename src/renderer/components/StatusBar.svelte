<script lang="ts">
  import { graphStore } from '../stores/graphStore.js';
  import { fileStore } from '../stores/fileStore.js';
  import { consoleStore } from '../stores/consoleStore.js';
  import { diagnosticsStore } from '../stores/diagnosticsStore.js';
  import { workspaceLayoutStore } from '../stores/workspaceLayoutStore.js';
</script>

<footer class="h-6 px-3 shrink-0 bg-surface-container-high text-[10px] text-m3-on-surface-variant flex items-center justify-between select-none"><span>{$graphStore.activeScope.type === 'main' ? 'Main graph' : `Function: ${$graphStore.activeScope.name}`} · {$graphStore.nodes.length} nodes{$fileStore.isDirty ? ' · Unsaved changes' : ''}</span><span class="flex items-center gap-3"><button class="hover:text-m3-on-surface focus-visible:outline focus-visible:outline-1 focus-visible:outline-m3-primary" on:click={() => consoleStore.openDock('problems')} aria-label="Open Problems">{$diagnosticsStore.errorCount > 0 ? `${$diagnosticsStore.errorCount} errors` : 'No errors'}{$diagnosticsStore.warningCount > 0 ? `, ${$diagnosticsStore.warningCount} warnings` : ''}</button><button class="hover:text-m3-on-surface" on:click={workspaceLayoutStore.reset}>Reset layout</button><span>{$consoleStore.isPaused ? 'Paused' : $consoleStore.isRunning ? 'Running' : 'Ready'} · Ctrl+D duplicate · Ctrl+Z undo</span></span></footer>
