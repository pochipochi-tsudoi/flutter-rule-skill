# flutter-rule-skill

Flutter/Dart 開発向けの Agent Skills を、npm publish せず GitHub リポジトリから
プロジェクトへ同期する CLI ツールです。

## 必要環境

- Node.js 18 以上
- `npx` が利用できる環境

## 使い方

```bash
npx github:pochipochi-tsudoi/flutter-rule-skill --agent agy
```

## オプション

| オプション | 説明 |
| --- | --- |
| `-a, --agent <names>` | 同期するエージェント名。複数指定はカンマ区切り |
| `-f, --force` | 既存ファイルを警告なしで上書き |
| `-l, --list` | 利用可能なエージェント名を表示 |
| `-h, --help` | ヘルプを表示 |

`--agent` には次の名前を指定できます。

- `agy`: Google Antigravity
- `codex`: Codex
- `opencode`: OpenCode
- `cursor`: Cursor
- `claude-code`: Claude Code
- `copilot`: GitHub Copilot
- `all`: すべてのエージェント

## 配置先

| エージェント | 配置先 |
| --- | --- |
| `agy`、`codex`、`opencode` | `.agents/` |
| `cursor` | `.cursor/` |
| `claude-code` | `.claude/` |
| `copilot` | `.github/` |

`all` を指定した場合も、同じ配置先への同期は一度だけ実行されます。

## 既存ファイルの扱い

通常実行では、プロジェクト内に同名ファイルが存在する場合は警告を表示してスキップします。
既存ファイルを置き換える場合だけ `--force` を指定してください。

## 開発

CLI のエントリポイントは `bin/cli.mjs` です。実装はレイヤーごとに `src/` 配下へ分離しています。

```text
bin/                         CLI エントリポイント
src/
├── domain/                  エージェント定義・名前解決
├── application/             同期ユースケース
├── infrastructure/          ファイルシステム操作
└── presentation/            CLI引数解析・出力
```

ローカルで CLI を実行する場合:

```bash
node bin/cli.mjs --help
node bin/cli.mjs --list
```
