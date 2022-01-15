// This file is part of cvbump, (https://github.com/tdesposito/ChangelogVersionTool)
// Copyright (C) Todd D. Esposito 2021.
// Distributed under the MIT License (see https://opensource.org/licenses/MIT).

exports.command = "pre"
exports.describe = "Set the project up for pre-prelease work"
exports.builder = {
  alpha: {
    alias: 'a',
    conflicts: ['beta', 'rc'],
    describe: "Set the pre-release version to '-alpha.0' (default)",
    group: 'Prerelease Stage; these are mutually exclusive:',
  },
  beta: {
    alias: 'b',
    conflicts: ['alpha', 'rc'],
    describe: "Set the pre-release version to '-beta.0'",
    group: 'Prerelease Stage; these are mutually exclusive:',
  },
  rc: {
    alias: 'r',
    conflicts: ['alpha', 'beta'],
    describe: "Set the pre-release version to '-rc.0'",
    group: 'Prerelease Stage; these are mutually exclusive:',
  },
  major: {
    alias: 'j',
    conflicts: ['minor', 'patch'],
    describe: "Bump the major component",
    group: "Target Component; these are mutually exclusive:",
  },
  minor: {
    alias: 'm',
    conflicts: ['major', 'patch'],
    describe: "Bump the minor component",
    group: "Target Component; these are mutually exclusive:",
  },
  patch: {
    alias: 'p',
    conflicts: ['minor', 'major'],
    describe: "Bump the patch component (default)",
    group: "Target Component; these are mutually exclusive:",
  },
}
exports.handler = require('../lib/pre')