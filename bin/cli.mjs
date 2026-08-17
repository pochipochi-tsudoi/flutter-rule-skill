#!/usr/bin/env node

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../src/presentation/cli/run-cli.mjs';
import { FileSynchronizer } from '../src/infrastructure/filesystem/file-synchronizer.mjs';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const synchronizer = new FileSynchronizer();
const exitCode = runCli(process.argv.slice(2), {
  repositoryRoot,
  projectRoot: process.cwd(),
  synchronizer,
  stdout: console.log,
  stderr: console.error,
  warning: console.warn,
});

if (exitCode !== 0) {
  process.exitCode = exitCode;
}
