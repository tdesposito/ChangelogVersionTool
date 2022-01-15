// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

exports.command = "generate"
exports.describe = "Generate the changelog in its entirety"
exports.builder = {}
exports.handler = require('../lib/generate')
