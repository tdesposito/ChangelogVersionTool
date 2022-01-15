// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

exports.command = "init"
exports.describe = "Initialize cvbump configuration"
exports.builder = {
  cfgfile: {
    alias: 'c',
    group: 'Command Options:',
    describe: 'Use "cvbump.json" or the named file as the configuration file'
  },
}
exports.handler = require('../lib/init')
