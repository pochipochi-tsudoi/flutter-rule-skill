# flutter-rule-skill

Flutter/Dart 開発向けの Agent Skills を、npm publish せず GitHub リポジトリから
プロジェクトへ同期する CLI ツールです。

## Flutter/Dartルール群

`flutter-rule` は、Flutter/Dartコードの品質と実装方針を統一するためのSKILL群です。
実装、レビュー、リファクタリングの内容に該当する個別SKILLを参照してください。
複数の領域に関係する変更では、該当するSKILLをすべて適用します。

### 個別SKILL

- **Dart省略記法**: プロパティから型を推論できる値の型名を省略し、`.値`形式で記述する。
- **Iconの使用**: 装飾目的でアイコンを追加せず、操作や状態の理解に必要な場合だけ使用する。
- **エラーの扱い**: 内部エラーはログへ記録し、画面には安全で具体的なメッセージを表示する。
- **Build Runner**: 生成対象に変更がある場合だけ`build_runner`を実行し、不要な再生成を避ける。
- **型キャストとJSON変換**: 不要な`as`を避け、Freezedなどの型付きモデルへJSON変換を集約する。
- **Null安全性**: 必須値を安易にnullableにせず、欠落した値は境界で検証してエラーとして扱う。
- **既存コードの保持**: 関連コードを確認し、指示された範囲以外の既存処理を変更しない。
- **Paddingとレイアウト**: 横方向の余白は`horizontal`、縦方向の間隔は`Gap()`で統一する。
- **UIパッケージ**: `flutter/material.dart`を直接使わず、`material_ui`をUIパッケージとして使用する。
- **最新のDart記法**: Dart 3.13以降を前提に、Primary Constructorなどの最新構文を適切に採用する。

## 必要環境

- Node.js 18 以上
- `npx` が利用できる環境

## 使い方

```bash
npx github:pochipochi-tsudoi/flutter-rule-skill --agent agy
```

### AGENTS.md の推奨設定

同期したスキルを AI エージェントに確実に遵守させるため、プロジェクトルートの `AGENTS.md` に以下のような指示を記載することを推奨します。

```markdown:AGENTS.md
# Flutter/Dart 実装ルール（厳格遵守）

Flutter/Dart の実装・修正・レビューを行う際は、**必ず事前に `flutter-rule` Skill を確認し、そのルールに完全に従って作業を行ってください。**

- **ルールの絶対遵守**: すべてのコード変更において、`flutter-rule`（および該当する個別SKILL）の規定を完全に遵守してください。自己判断によるルールの無視や例外的な実装は一切認めません。
- **違反の禁止**: ルールに反する実装（不適切な型キャスト、指定外のUIコンポーネント使用、不適切なNull安全性の扱い、不要な既存コードの変更など）は厳禁です。
- **作業前の確認**: コードの記述・変更を開始する前に、必ず関連する個別SKILLを参照し、ルールに則った方針であることを確認した上で実装してください。
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

CLI のエントリポイントは `bin/cli.ts` です。実装はレイヤーごとに `src/` 配下へ分離し、
ビルド成果物を `dist/` に出力します。

```text
bin/                         CLIエントリポイント（TypeScript）
dist/                        ビルド成果物
src/
├── domain/                  エージェント定義・名前解決
├── application/             同期ユースケース
├── infrastructure/          ファイルシステム操作
└── presentation/            CLI引数解析・出力
```

ローカルで CLI を実行する場合:

```bash
npm install
npm run build
node dist/bin/cli.js --help
node dist/bin/cli.js --list
```
