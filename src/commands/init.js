// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

exports.command = "init"
exports.describe = "Initialize cvbump configuration"
exports.builder = {
  all: {
    alias: 'a',
    group: 'Command Options:',
    describe: "Add ALL configuration parameters to the configuration file"
  },
  cfgfile: {
    alias: 'c',
    group: 'Command Options:',
    describe: 'Use "cvbump.json" or the named file as the configuration file'
  },
  commit: {
    default: true,
    group: 'Command Options:',
    describe: "Git commit changed file",
  },
}
exports.handler = require('../lib/init')
