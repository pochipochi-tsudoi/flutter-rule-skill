export function parseArguments(args) {
  const options = { agent: null, force: false, list: false, help: false };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '-h' || argument === '--help') {
      options.help = true;
      continue;
    }
    if (argument === '-l' || argument === '--list') {
      options.list = true;
      continue;
    }
    if (argument === '-f' || argument === '--force') {
      options.force = true;
      continue;
    }
    if (argument === '-a' || argument === '--agent') {
      const value = args[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`${argument} にはエージェント名が必要です。`);
      }
      options.agent = value;
      index += 1;
      continue;
    }
    if (argument.startsWith('--agent=')) {
      const value = argument.slice('--agent='.length);
      if (!value) {
        throw new Error('--agent にはエージェント名が必要です。');
      }
      options.agent = value;
      continue;
    }

    throw new Error(`不明なオプションまたは引数です: ${argument}`);
  }

  return options;
}
