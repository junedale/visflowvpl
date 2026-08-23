import { writable } from 'svelte/store';
import { GraphValidator, type ValidationIssue } from '../../compiler/validator.js';
import { graphStore, type GraphState } from './graphStore.js';

export interface DiagnosticsState {
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
}

const { subscribe, set } = writable<DiagnosticsState>({ issues: [], errorCount: 0, warningCount: 0 });

function validateGraph(state: GraphState): ValidationIssue[] {
  return GraphValidator.validate(state.nodes, state.wires, state.variables, state.functions);
}

function updateDiagnostics(state: GraphState): ValidationIssue[] {
  const issues = validateGraph(state);
  set({
    issues,
    errorCount: issues.filter((issue) => issue.type === 'error').length,
    warningCount: issues.filter((issue) => issue.type === 'warning').length,
  });
  return issues;
}

// Diagnostics are derived from the active graph, so the Problems panel is current before Run is pressed.
graphStore.subscribe(updateDiagnostics);

export const diagnosticsStore = {
  subscribe,
  refresh: updateDiagnostics,
};
