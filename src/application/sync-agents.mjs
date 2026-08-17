import { join, resolve } from 'node:path';
import { agentDefinitions, resolveAgentNames } from '../domain/agent-definitions.mjs';

function createSyncTargets(agentNames, repositoryRoot, projectRoot) {
  const targets = new Map();

  for (const agentName of agentNames) {
    const definition = agentDefinitions[agentName];
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

export function syncAgents({ agentValue, force, repositoryRoot, projectRoot, synchronizer }) {
  const agentNames = resolveAgentNames(agentValue);
  const targets = createSyncTargets(agentNames, repositoryRoot, projectRoot);
  const summary = { copied: 0, skipped: 0, targets: [] };

  for (const target of targets) {
    const result = synchronizer.sync(target.source, target.target, {
      force,
    });
    summary.copied += result.copied;
    summary.skipped += result.skipped;
    summary.targets.push({ ...target, result });
  }

  return summary;
}
