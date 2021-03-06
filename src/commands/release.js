// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).


exports.command = "release"
exports.describe = "Bump to the next release version, update the changelog, and tag the release."
exports.builder = {
    commit: {
        alias: 'c',
        describe: "Git commit changed file",
        default: true,
    },
    tag: {
        alias: 't',
        describe: "Tag the commit",
        default: true,
    },
}
exports.handler = require('../lib/release')

