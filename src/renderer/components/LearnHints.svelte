<script lang="ts">
  export let visible = false;
  export let onClose: () => void = () => {};
  function dismiss() { localStorage.setItem('visflow-learn-hints-dismissed', 'true'); onClose(); }
</script>

{#if visible}
  <section class="absolute right-5 top-5 w-72 rounded-2xl bg-surface-container border border-m3-primary/30 shadow-m3-4 p-4 z-30" aria-label="Learning hints">
    <div class="flex justify-between gap-3"><div><p class="text-[10px] font-bold uppercase tracking-wider text-m3-primary">Quick tip</p><h2 class="mt-1 text-sm font-semibold">Debug one node at a time</h2></div><button class="text-m3-outline hover:text-m3-on-surface" on:click={dismiss} aria-label="Dismiss learning hints">×</button></div>
    <p class="mt-2 text-xs leading-relaxed text-m3-on-surface-variant">Hover a node and select its small pink dot to add a breakpoint. Run the graph, then open Debug to inspect the pause and trace.</p>
  </section>
{/if}
