import { getAvailableAgentNames, agentDefinitions } from '../../domain/agent-definitions.mjs';
import { parseArguments } from './argument-parser.mjs';
import { syncAgents } from '../../application/sync-agents.mjs';

const helpText = `使い方:
  npx github:<ユーザー名>/<リポジトリ名> --agent <names> [options]

オプション:
  -a, --agent <names>  同期するエージェント名（カンマ区切り）
  -f, --force          既存のファイルを警告なしで上書き
  -l, --list           利用可能なエージェント名一覧を表示
  -h, --help           ヘルプを表示

利用可能なエージェント:
  ${getAvailableAgentNames().join(', ')}, all
`;

function printList(stdout) {
  for (const [name, definition] of Object.entries(agentDefinitions)) {
    stdout(`${name}\t${definition.label}`);
  }
}

export function runCli(args, { repositoryRoot, projectRoot, synchronizer, stdout, stderr, warning }) {
  try {
    const options = parseArguments(args);

    if (options.help) {
      stdout(helpText);
      return 0;
    }
    if (options.list) {
      printList(stdout);
      return 0;
    }

    const summary = syncAgents({
      agentValue: options.agent,
      force: options.force,
      repositoryRoot,
      projectRoot,
      synchronizer: {
        sync(source, target, syncOptions) {
          return synchronizer.sync(source, target, { ...syncOptions, warning });
        },
      },
    });

    for (const target of summary.targets) {
      stdout(`${target.agentName}: ${target.target}`);
    }
    stdout(`同期完了: ${summary.copied} ファイルを配置しました${summary.skipped ? `、${summary.skipped} ファイルをスキップしました` : ''}。`);
    return 0;
  } catch (error) {
    stderr(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}
