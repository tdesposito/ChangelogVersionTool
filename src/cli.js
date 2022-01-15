#!/usr/bin/env node

// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

const { hideBin } = require('yargs/helpers')
const args = require('yargs')(hideBin(process.argv))
  .scriptName('cvbump')
  .usage('Usage: $0 [command] [opts]\n\nUse $0 <command> --help for help with individual commands.')
  .commandDir('commands')
  .strict()
  .alias('h', 'help')
  .alias('v', 'version')
  .help()
  .argv

if (args._.length == 0) {
  require('./lib/auto')()
}
