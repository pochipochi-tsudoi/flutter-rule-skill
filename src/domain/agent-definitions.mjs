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

export function getAvailableAgentNames() {
  return Object.keys(agentDefinitions);
}

export function resolveAgentNames(value) {
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

  const unknownNames = names.filter((name) => !agentDefinitions[name]);
  if (unknownNames.length > 0) {
    throw new Error(`利用できないエージェント名です: ${unknownNames.join(', ')}`);
  }

  return [...new Set(names)];
}
