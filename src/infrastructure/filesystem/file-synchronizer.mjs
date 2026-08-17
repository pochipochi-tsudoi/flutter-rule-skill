import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readlinkSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

export class FileSynchronizer {
  sync(source, target, { force = false, warning = console.warn } = {}) {
    if (!existsSync(source)) {
      throw new Error(`配布元が見つかりません: ${source}`);
    }

    return this.copyEntry(source, target, force, '', warning);
  }

  copyEntry(source, target, force, relativePath, warning) {
    const sourceStats = lstatSync(source);
    const displayPath = relativePath || target;

    if (sourceStats.isDirectory()) {
      if (existsSync(target) && !statSync(target).isDirectory()) {
        if (force) {
          rmSync(target, { force: true });
        } else {
          warning(`警告: ディレクトリを作成できないためスキップしました: ${displayPath}`);
          return { copied: 0, skipped: 1 };
        }
      }

      mkdirSync(target, { recursive: true });
      return readdirSync(source, { withFileTypes: true }).reduce(
        (result, entry) => {
          const childResult = this.copyEntry(
            join(source, entry.name),
            join(target, entry.name),
            force,
            join(relativePath, entry.name),
            warning,
          );
          return {
            copied: result.copied + childResult.copied,
            skipped: result.skipped + childResult.skipped,
          };
        },
        { copied: 0, skipped: 0 },
      );
    }

    if (existsSync(target) && !force) {
      warning(`警告: 既存ファイルをスキップしました: ${displayPath}`);
      return { copied: 0, skipped: 1 };
    }

    mkdirSync(dirname(target), { recursive: true });
    if (sourceStats.isSymbolicLink()) {
      if (existsSync(target)) {
        rmSync(target, { recursive: true, force: true });
      }
      symlinkSync(readlinkSync(source), target);
    } else {
      if (existsSync(target) && statSync(target).isDirectory()) {
        rmSync(target, { recursive: true, force: true });
      }
      copyFileSync(source, target);
    }

    return { copied: 1, skipped: 0 };
  }
}
