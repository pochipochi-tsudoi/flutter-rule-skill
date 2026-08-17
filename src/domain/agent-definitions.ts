export const agentDefinitions = Object.freeze({
  agy: Object.freeze({
    label: 'Google Antigravity',
    source: ['agents', 'agents', '.agents'],
    target: ['.agents'],
  }),
  codex: Object.freeze({
    label: 'Codex (CLI/Agent)',
    source: ['agents', 'agents', '.agents'],
    target: ['.agents'],
  }),
  opencode: Object.freeze({
    label: 'OpenCode',
    source: ['agents', 'agents', '.agents'],
    target: ['.agents'],
  }),
  cursor: Object.freeze({
    label: 'Cursor',
    source: ['agents', 'cursor', '.cursor'],
    target: ['.cursor'],
  }),
  'claude-code': Object.freeze({
    label: 'Claude Code',
    source: ['agents', 'claude-code', '.claude'],
    target: ['.claude'],
  }),
  copilot: Object.freeze({
    label: 'GitHub Copilot',
    source: ['agents', 'copilot', '.github'],
    target: ['.github'],
  }),
});

export type AgentName = keyof typeof agentDefinitions;

export function getAvailableAgentNames(): AgentName[] {
  return Object.keys(agentDefinitions) as AgentName[];
}

export function resolveAgentNames(value: string | null): AgentName[] {
  if (!value) {
    throw new Error('--agent でエージェント名を指定してください。');
  }

  const names = value
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  if (names.length === 0) {
    throw new Error('--agent でエージェント名を指定してください。');
  }

  if (names.includes('all')) {
    return getAvailableAgentNames();
  }

  const unknownNames = names.filter((name) => !(name in agentDefinitions));
  if (unknownNames.length > 0) {
    throw new Error(`利用できないエージェント名です: ${unknownNames.join(', ')}`);
  }

  return [...new Set(names)] as AgentName[];
}
