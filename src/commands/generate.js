// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

exports.command = "generate"
exports.describe = "Generate the changelog in its entirety"
exports.builder = {
    commit: {
        alias: 'c',
        describe: "Git commit changed file",
        default: false,
    },
}
exports.handler = require('../lib/generate')
