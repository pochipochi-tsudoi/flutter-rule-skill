import { syncAgents, type Synchronizer } from '../../application/sync-agents.js';
import { agentDefinitions, getAvailableAgentNames } from '../../domain/agent-definitions.js';
import { parseArguments } from './argument-parser.js';

type Writer = (message: string) => void;

export interface CliDependencies {
  repositoryRoot: string;
  projectRoot: string;
  synchronizer: Synchronizer;
  stdout: Writer;
  stderr: Writer;
  warning: Writer;
}

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

function printList(stdout: Writer): void {
  for (const [name, definition] of Object.entries(agentDefinitions)) {
    stdout(`${name}\t${definition.label}`);
  }
}

export function runCli(args: string[], dependencies: CliDependencies): number {
  try {
    const options = parseArguments(args);

    if (options.help) {
      dependencies.stdout(helpText);
      return 0;
    }
    if (options.list) {
      printList(dependencies.stdout);
      return 0;
    }

    const summary = syncAgents({
      agentValue: options.agent,
      force: options.force,
      repositoryRoot: dependencies.repositoryRoot,
      projectRoot: dependencies.projectRoot,
      synchronizer: {
        sync(source, target, syncOptions) {
          return dependencies.synchronizer.sync(source, target, {
            ...syncOptions,
            warning: dependencies.warning,
          });
        },
      },
    });

    for (const target of summary.targets) {
      dependencies.stdout(`${target.agentName}: ${target.target}`);
    }
    dependencies.stdout(`同期完了: ${summary.copied} ファイルを配置しました${summary.skipped ? `、${summary.skipped} ファイルをスキップしました` : ''}。`);
    return 0;
  } catch (error) {
    dependencies.stderr(`エラー: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}
