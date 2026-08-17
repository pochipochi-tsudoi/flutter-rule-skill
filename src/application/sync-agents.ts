import { resolve } from 'node:path';
import { agentDefinitions, resolveAgentNames } from '../domain/agent-definitions.js';

export interface SyncResult {
  copied: number;
  skipped: number;
}

export interface SyncOptions {
  force: boolean;
  warning?: (message: string) => void;
}

export interface Synchronizer {
  sync(source: string, target: string, options: SyncOptions): SyncResult;
}

export interface SyncSummary {
  copied: number;
  skipped: number;
  targets: Array<{
    agentName: string;
    source: string;
    target: string;
    result: SyncResult;
  }>;
}

function createSyncTargets(agentNames: string[], repositoryRoot: string, projectRoot: string) {
  const targets = new Map<string, { agentName: string; source: string; target: string }>();

  for (const agentName of agentNames) {
    const definition = agentDefinitions[agentName as keyof typeof agentDefinitions];
    const target = resolve(projectRoot, ...definition.target);

    if (!targets.has(target)) {
      targets.set(target, {
        agentName,
        source: resolve(repositoryRoot, ...definition.source),
        target,
      });
    }
  }

  return [...targets.values()];
}

export function syncAgents({
  agentValue,
  force,
  repositoryRoot,
  projectRoot,
  synchronizer,
}: {
  agentValue: string | null;
  force: boolean;
  repositoryRoot: string;
  projectRoot: string;
  synchronizer: Synchronizer;
}): SyncSummary {
  const agentNames = resolveAgentNames(agentValue);
  const targets = createSyncTargets(agentNames, repositoryRoot, projectRoot);
  const summary: SyncSummary = { copied: 0, skipped: 0, targets: [] };

  for (const target of targets) {
    const result = synchronizer.sync(target.source, target.target, { force });
    summary.copied += result.copied;
    summary.skipped += result.skipped;
    summary.targets.push({ ...target, result });
  }

  return summary;
}
